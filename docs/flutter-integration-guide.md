# Flutter Integration Guide: `/available-for-driver`

---

## Why Use This Endpoint?

This endpoint finds nearby parcels for drivers to pick up based on their **current location** and **saved route**.

- **Socket (`driver:location-update`)**: Real-time location updates from the driver app. The backend calculates if the driver is on their saved route.
- **Listen (`driver:available-parcels`)**: Receives the list of available parcels based on driver location.
- **REST API**: Alternative to socket for one-time requests (e.g., manual refresh button).

---

## Parameters

### REST API & Socket (Emit)

| Parameter | Type | Mandatory | Description |
|-----------|------|----------|-------------|
| `currentLat` | string/number | **Yes** | Driver's current latitude (-90 to 90) |
| `currentLng` | string/number | **Yes** | Driver's current longitude (-180 to 180) |
| `heading` | string/number | No | Driver's driving direction (0-360 degrees). Used to check if driving toward destination. |
| `radiusMeters` | string/number | No | Search radius in meters (default: 1500). Used in geo query. |
| `page` | string/number | No | Page number for pagination (default: 1) |
| `limit` | string/number | No | Items per page (default: 10) |

### Why `currentLat` & `currentLng` are Mandatory?

The entire parcel discovery logic depends on the driver's current position:
1. **Geo Query**: Uses `$near` operator to find parcels within `radiusMeters` from driver location
2. **Route Check**: Calculates distance from driver to saved route
3. **Scoring**: Calculates distance from driver to parcel pickup point
4. **Sorting**: Sorts parcels by distance or route score

Without location, the endpoint cannot discover nearby parcels.

---

## Socket Events

### Emit: `driver:location-update`

Send driver location to get real-time parcel updates.

```dart
_socket?.emit('driver:location-update', {
  'currentLat': 23.8103,
  'currentLng': 90.4125,
  'heading': 45.0,           // optional - driver's compass heading
  'radiusMeters': 1500,      // optional - search radius in meters
});
```

**Why emit this?**
- Drivers are constantly moving
- Each emit triggers a fresh parcel search based on new location
- Backend checks if driver is on saved route or in nearby-fallback mode
- Returns parcels sorted by relevance (route-based or distance-based)

**Throttle**: Max 1 emit per 2 seconds (backend enforces this).

---

### Listen: `driver:available-parcels`

Receive available parcels after emitting location.

```dart
_socket!.on('driver:available-parcels', (data) {
  final parcels = data['data'];    // List<Parcel>
  final meta = data['meta'];        // Metadata
  final timestamp = data['timestamp']; // Server timestamp
  
  // Update UI with parcels
});
```

**Why listen to this?**
- Provides real-time parcel updates as driver moves
- No need to manually poll REST API
- More responsive than REST calls
- Includes metadata about discovery mode

---

## API Response Structure

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
        "id": "507f1f77bcf86cd799439011",
        "pickup_location": {
          "address": "123 Main St, Dhaka",
          "latitude": 23.8103,
          "longitude": 90.4125
        },
        "dropoff_location": {
          "address": "456 Market Rd, Dhaka",
          "latitude": 23.8200,
          "longitude": 90.4300
        },
        "size": "medium",
        "reward": 150.00,
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

### Response Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `meta.total` | number | Total parcels found |
| `meta.page` | number | Current page |
| `meta.limit` | number | Items per page |
| `meta.totalPages` | number | Total pages |
| `meta.discoveryMode` | string | `"route-based"` or `"nearby-fallback"` |
| `meta.distanceToSavedRoute` | number | Distance in meters from driver's saved route |
| `meta.isOnRoute` | boolean | true if driver is within 500m of saved route |
| `data[].id` | string | Parcel ID |
| `data[].pickup_location` | object | Pickup location with address, lat, lng |
| `data[].dropoff_location` | object | Dropoff location |
| `data[].size` | string | Parcel size (small, medium, large) |
| `data[].reward` | number | Payment amount in Taka |
| `data[].distanceToPickup` | number | Distance in meters from driver to pickup |
| `data[].distanceToDropoff` | number | Distance in meters from driver to dropoff |
| `data[].distanceToRoute` | number | Distance in meters to saved route |
| `data[].inRouteScore` | number | 0-1 score (higher = better for route) |
| `data[].ahead` | boolean | true if pickup is ahead on route |
| `data[].detour_km` | number | Extra distance if pickup/dropoff added to route |

---

## REST API Call

```dart
final response = await dio.get(
  '/driver/available-for-driver',
  queryParameters: {
    'currentLat': '23.8103',
    'currentLng': '90.4125',
    // optional:
    // 'heading': '45',
    // 'radiusMeters': '1500',
    // 'page': '1',
    // 'limit': '10',
  },
);
```

---

## Quick Reference

| Action | Event/Endpoint | Mandatory Params |
|--------|----------------|------------------|
| Emit | `driver:location-update` | currentLat, currentLng |
| Listen | `driver:available-parcels` | - |
| REST | `GET /driver/available-for-driver` | currentLat, currentLng |

---

**Flow:**
1. Driver app gets current GPS location
2. Emit `driver:location-update` with lat/lng (throttled to every 2s)
3. Backend checks if driver is on saved route
4. Backend finds parcels within radius (geo query)
5. Backend calculates scores & sorts parcels
6. Listen `driver:available-parcels` receives results
7. Update UI with parcel list