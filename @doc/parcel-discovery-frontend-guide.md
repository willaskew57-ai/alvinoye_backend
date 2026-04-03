# Frontend Update Guide: Parcel Discovery Feature

## Overview

This document outlines the necessary frontend updates to integrate with the `/available-for-driver` API.

**Dynamic Discovery Mode:**
- **route-based**: When driver is on/near their saved route
- **nearby-fallback**: When driver is off-route or moving in wrong direction

---

## 1. API Integration

### GET /driver/available-for-driver

**Endpoint:** `GET /api/v1/driver/available-for-driver`

**Parameters:**
```typescript
interface AvailableParcelsParams {
  currentLat: number;    // Driver live latitude (required)
  currentLng: number;    // Driver live longitude (required)
  heading?: number;    // Movement direction 0-360 (optional)
  radiusMeters?: number; // Search radius (default: 1500)
  page?: number;      // Pagination (default: 1)
  limit?: number;    // Results per page (default: 10)
}
```

**Request Example:**
```typescript
const fetchAvailableParcels = async (params: AvailableParcelsParams) => {
  const queryString = new URLSearchParams({
    currentLat: params.currentLat.toString(),
    currentLng: params.currentLng.toString(),
    ...(params.heading && { heading: params.heading.toString() }),
    ...(params.radiusMeters && { radiusMeters: params.radiusMeters.toString() }),
    ...(params.page && { page: params.page.toString() }),
    ...(params.limit && { limit: params.limit.toString() }),
  }).toString();

  const response = await fetch(
    `${API_BASE}/driver/available-for-driver?${queryString}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }
  );
  return response.json();
};
```

**Response:**
```typescript
interface ParcelDiscoveryItem {
  id: string;
  pickup_location: { latitude: number; longitude: number; address: string };
  dropoff_location: { latitude: number; longitude: number; address: string };
  size: string;
  reward: number;
  distanceToRoute: number;   // meters
  inRouteScore: number;    // 0-1
  ahead: boolean;
  detour_km?: number;     // only in route-based mode
  discoveryMode: 'route-based' | 'nearby-fallback';
}

interface AvailableParcelsResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  discoveryMode: 'route-based' | 'nearby-fallback';
  distanceToSavedRoute: number; // meters from saved route
  isOnRoute: boolean;
}

interface AvailableParcelsResponse {
  success: boolean;
  data: ParcelDiscoveryItem[];
  meta: AvailableParcelsResponseMeta;
}
```

---

## 2. React Hook Example

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseParcelDiscoveryProps {
  authToken: string;
}

export const useParcelDiscovery = ({ authToken }: UseParcelDiscoveryProps) => {
  const [parcels, setParcels] = useState<ParcelDiscoveryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveryMode, setDiscoveryMode] = useState<string>('nearby-fallback');
  const [isOnRoute, setIsOnRoute] = useState(false);

  const fetchParcels = useCallback(async (params: {
    currentLat: number;
    currentLng: number;
    heading?: number;
    radiusMeters?: number;
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const queryString = new URLSearchParams({
        currentLat: params.currentLat.toString(),
        currentLng: params.currentLng.toString(),
        ...(params.heading && { heading: params.heading.toString() }),
        ...(params.radiusMeters && { radiusMeters: params.radiusMeters.toString() }),
        ...(params.page && { page: params.page.toString() }),
        ...(params.limit && { limit: params.limit.toString() }),
      }).toString();

      const response = await fetch(
        `${API_BASE}/driver/available-for-driver?${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setParcels(data.data);
        setDiscoveryMode(data.meta.discoveryMode);
        setIsOnRoute(data.meta.isOnRoute);
      } else {
        setError('Failed to fetch parcels');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    parcels,
    loading,
    error,
    discoveryMode,
    isOnRoute,
    fetchParcels,
  };
};
```

---

## 3. UI Component: Parcel Discovery Screen

```typescript
const ParcelDiscoveryScreen = () => {
  const { parcels, loading, discoveryMode, isOnRoute, fetchParcels } = useParcelDiscovery({
    authToken,
  });

  const [driverLocation, setDriverLocation] = useState({ lat: 0, lng: 0 });

  // Get driver location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setDriverLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // Fetch parcels when location updates
  useEffect(() => {
    if (driverLocation.lat) {
      fetchParcels({
        currentLat: driverLocation.lat,
        currentLng: driverLocation.lng,
      });
    }
  }, [driverLocation]);

  // Get heading from movement
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      const heading = position.coords.heading;
      if (heading != null) {
        fetchParcels({
          currentLat: position.coords.latitude,
          currentLng: position.coords.longitude,
          heading,
        });
      }
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getModeColor = () => {
    if (discoveryMode === 'route-based') return 'green';
    return 'gray';
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeIndicator}>
        <Text style={{ color: getModeColor() }}>
          {isOnRoute ? 'On Route' : 'Nearby'}: {discoveryMode}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={parcels}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ParcelCard
              parcel={item}
              onPress={() => handleSelectParcel(item)}
            />
          )}
        />
      )}
    </View>
  );
};
```

---

## 4. Socket Integration (Real-time Updates)

```typescript
import { io } from 'socket.io-client';

class ParcelDiscoverySocket {
  private socket: any;
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      auth: { token: this.authToken },
      transports: ['websocket'],
    });

    this.socket.on('driver:available-parcels', (data: any) => {
      console.log('Available parcels:', data.data);
      console.log('Discovery mode:', data.meta.discoveryMode);
      console.log('Is on route:', data.meta.isOnRoute);
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  sendLocationUpdate(params: {
    currentLat: number;
    currentLng: number;
    heading?: number;
    radiusMeters?: number;
  }) {
    if (this.socket?.connected) {
      this.socket.emit('driver:location-update', params);
    }
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
```

---

## 5. Summary Checklist

| Task | Status |
|------|--------|
| Create API service for `/available-for-driver` | TODO |
| Implement React hook | TODO |
| Update map with dynamic mode UI | TODO |
| Add socket real-time updates | TODO |

---

## 6. Key Points

1. **Only send currentLat/currentLng** - destination is自动 from driver's saved profile
2. **Heading improves detection** - sending heading helps detect wrong direction
3. **Discovery mode in response** - use `meta.discoveryMode` to show route-based vs nearby
4. **Socket throttled** - backend limits to 2s intervals
5. **Color-code: green = on-route, gray = nearby-fallback**