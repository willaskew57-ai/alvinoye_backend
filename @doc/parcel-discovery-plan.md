# Parcel Discovery Feature Plan: `/available-for-driver`

## 1. Objective

Enable driver-side parcel discovery that is:

- route-aware (not just radial proximity)
- real-time (dynamic live updates)
- prioritized for parcels ahead/on-path
- detail-enabled (pickup/dropoff/size/reward)
- actionable (tap/select + route integration)

## 2. Core Requirements

1. Input: live driver location + intended destination/route
2. Output: filtered parcels along/near route
3. Continuous refresh based on live location changes
4. Prioritize forward path vs behind/far off-route
5. Tap result payload includes pickup/dropoff route details
6. Parcel selection integrates pickup & dropoff into navigation

## 3. API Design

### `GET /driver/available-for-driver`

Preferred params:

- `fromLat`, `fromLng` (required)
- `toLat`, `toLng` (optional, recommended)
- `routePolyline` or `routeWaypoints` (optional, very helpful)
- `radiusMeters` (default 1500)
- `limit`, `offset`, `sort` (priority)

Response sample:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "pickup_location": {"lat": ..., "lng": ...},
      "dropoff_location": {"lat": ..., "lng": ...},
      "size": "small",
      "reward": 250,
      "distanceToRoute": 120,
      "inRouteScore": 0.93,
      "ahead": true
    }
  ]
}
```

### `POST /driver/parcel/select`

- body: `{ parcel_id, driver_id, routeContext }`
- returns: updated route injection points

## 4. Backend Components

### `driver.controller.getAvailableParcelsForDriver`

- parse query + user
- call `DriverServices.getAvailableParcelsFromDB(driverId, query)`
- return filtered/paginated data

### `driver.service.getAvailableParcelsFromDB(driverId, query)`

1. determine route context (explicit or persisted)
2. query available parcels (Mongo `status: available` + geospatial `near`)
3. compute `distanceToRoute` using route polyline geometry
4. compute direction/scoring: ahead/behind + route proximity + reward
5. sort & limit
6. attach detail fields

### parcel model requirements

- geospatial indexes on pickup/dropoff points
- fields: `status`, `pickup_location`, `dropoff_location`, `size`, `reward`

## 5. Real-time update path

- socket event: `driver:location-update` with current coords + heading
- server event: `driver:available-parcels` with ranked candidate list
- recompute on driver tick and payload change

## 6. Filtration logic (in prioritized order)

1. within `radiusMeters` from current location
2. within `routeBufferMeters` from route polyline
3. forward direction angle diff < 90 degrees
4. lower `distanceToRoute` first
5. high `reward` / low `detour`

## 7. Selection workflow

1. user taps parcel on map
2. call select endpoint
3. backend assigns parcel to driver, updates status
4. backend returns `pickup` + `dropoff` route insertion data
5. frontend updates nav and displays detail card

## 8. migration/checklist

- ensure existing parcel indexes (2dsphere)
- add validations in `driver.validation.ts`
- implement `DriverServices` route scoring helpers
- add/expand tests for path-based parcel filtering
- add socket event handling in `src/socket`

## 9. Release plan

1. Phase 1: `GET /available-for-driver` with route fallback nearest-only
2. Phase 2: route proximity scoring + ahead preference
3. Phase 3: live socket refresh
4. Phase 4: selection-based route replan adaptions

## 10. Notes

- fallback path if no route: standard nearby list
- handle stale context by expiring route buffer
- avoid overload by capping message rate (e.g., 2s throttle)
