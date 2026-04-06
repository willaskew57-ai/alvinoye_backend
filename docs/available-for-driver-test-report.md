# Test Report: `/available-for-driver` Route

## Overview

| Item | Details |
|------|---------|
| **Endpoint** | `GET /api/v1/driver/available-for-driver` |
| **Auth Required** | `USER_ROLE.DRIVER` |
| **Module** | `driver` |
| **Controller** | `DriverController.getAvailableParcelsForDriver` |
| **Service** | `DriverServices.getAvailableParcelsFromDB` |

---

## Request Validation

### Required Query Parameters

| Parameter | Type | Validation Rules |
|-----------|------|------------------|
| `currentLat` | string | Must be valid latitude (-90 to 90) |
| `currentLng` | string | Must be valid longitude (-180 to 180) |

### Optional Query Parameters

| Parameter | Type | Validation Rules |
|-----------|------|------------------|
| `heading` | string | Number between 0-360 |
| `radiusMeters` | string | Positive number |
| `page` | string | Positive number |
| `limit` | string | Positive number |

**Validation Schema Location**: `src/app/v1/modules/driver/driver.validation.ts:68-106`

---

## Business Logic Analysis

### 1. Driver Profile Check
- Retrieves driver profile from `Driver` collection by `user_id`
- Retrieves vehicle profile from `Vehicle` collection by `user_id`
- Throws error if either profile not found

### 2. Route-Based Discovery
- Uses driver's saved `from` and `to` coordinates (from driver profile)
- Calculates distance to saved route using `calculateDistanceToRouteLine()`
- Determines if driver is "on route" (within 0.5km / 500m buffer)

### 3. Discovery Modes
| Mode | Condition |
|------|-----------|
| `route-based` | Driver is within 500m of saved route |
| `nearby-fallback` | Driver is outside saved route |

### 4. Parcel Query (GeoJSON)
```javascript
{
  status: PARCEL_STATUS.PENDING,
  vehicle_type: vehicle.vehicle_type,
  price_status: PRICE_STATUS.ACCEPTED,
  accepted_by: null,
  pickup_location: { $near: { $geometry: Point, $maxDistance: radiusMeters } }
}
```

### 5. Parcel Scoring & Sorting

**Route-based mode:**
- Prioritizes parcels "ahead" on the route
- Sorts by distance to route
- Uses `inRouteScore` for tie-breaking

**Nearby-fallback mode:**
- Sorts by distance to pickup
- Prioritizes higher reward parcels

### 6. Detour Calculation
- Uses Google Maps Directions API
- Calculates additional distance when adding parcel pickup/dropoff
- Only includes parcels with detour ≤ 20km

---

## Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Available parcels fetched successfully!",
  "data": {
    "meta": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "discoveryMode": "route-based",
      "distanceToSavedRoute": 320,
      "isOnRoute": true
    },
    "data": [
      {
        "id": "...",
        "pickup_location": { "address": "...", "latitude": 23.7, "longitude": 90.4 },
        "dropoff_location": { "address": "...", "latitude": 23.8, "longitude": 90.5 },
        "size": "medium",
        "reward": 150,
        "distanceToPickup": 500,
        "distanceToDropoff": 1200,
        "distanceToRoute": 200,
        "inRouteScore": 0.85,
        "ahead": true,
        "detour_km": 5.2
      }
    ]
  }
}
```

---

## Socket Integration

### Event: `driver:location-update`
- **Auth**: Requires driver role
- **Throttle**: 2 seconds between updates
- **Service**: Uses same `DriverServices.getAvailableParcelsFromDB`
- **Response**: Emits `driver:available-parcels` event

**Location**: `src/socket/index.ts:153-202`

---

## Potential Issues Identified

### 1. Missing Error Handling for Invalid Driver/Vehicle
- If driver or vehicle profile is missing, throws generic "not found" errors
- Consider more specific error messages

### 2. Google Maps API Dependency
- Detour calculation fails silently if API key is missing or invalid
- Parcels still included without detour_km field

### 3. No Rate Limiting on REST Endpoint
- Unlike socket event, REST endpoint has no throttling
- Could be abused for repeated queries

### 4. Latitude/Longitude Parsing
- Uses `Number()` which allows "23.7" (string) but fails on invalid input
- No default fallback if params are missing after validation

---

## Test Recommendations

1. **Valid Request**: Test with valid lat/lng, expect 200 with parcel list
2. **Missing Params**: Test without currentLat/currentLng, expect 400 validation error
3. **Invalid Lat/Lng**: Test with out-of-range values, expect validation error
4. **No Parcels**: Test in area with no pending parcels, expect empty data array
5. **Off-Route Driver**: Test when driver is far from saved route, expect "nearby-fallback" mode
6. **Socket Event**: Test `driver:location-update` event, expect throttled response

---

## Files Referenced

| File | Purpose |
|------|---------|
| `src/app/v1/modules/driver/driver.route.ts:108-113` | Route definition |
| `src/app/v1/modules/driver/driver.controller.ts:96-112` | Controller handler |
| `src/app/v1/modules/driver/driver.service.ts:328-632` | Main service logic |
| `src/app/v1/modules/driver/driver.validation.ts:68-106` | Zod validation schema |
| `src/socket/index.ts:153-202` | Real-time event handler |

---

*Report generated: 2026-04-06*


