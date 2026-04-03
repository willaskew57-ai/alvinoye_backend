# Dynamic Parcel Discovery Plan (Route-Based + Nearby Fallback)

## Objective

Implement a **dynamic parcel discovery system** for commuters/drivers that:

- shows **route-based relevant parcels** while the commuter is actively traveling on or near their planned route
- automatically **falls back to nearby parcel discovery** when the commuter is clearly off-route or moving in an unrelated/opposite direction
- continuously updates parcel visibility and ranking using **live location**
- allows parcel selection to integrate pickup and dropoff into the commuter’s trip flow

---

# Core Product Behavior

The system will operate in **two discovery modes**:

## 1. Route-Based Discovery Mode
Used when the commuter is:

- currently **on or near** the saved/planned route
- moving in a direction that still aligns with the route destination
- within acceptable route deviation limits

### In this mode:
The system should prioritize parcels that are:

- along the route
- close to the route path
- slightly ahead of the commuter
- low detour
- high reward (secondary ranking factor)

---

## 2. Nearby Fallback Discovery Mode
Used when the commuter is:

- significantly **off the planned route**
- moving in the **opposite or unrelated direction**
- no longer realistically following the saved route

### In this mode:
The system should stop relying on route scoring and instead show:

- nearby available parcels around the commuter’s **live location**
- optionally ranked by:
  - distance
  - reward
  - pickup convenience

---

# High-Level Functional Flow

## Planned Route Source
At signup or profile setup, the commuter already has:

- `from`
- `to`

stored in the database.

This saved route acts as the **default intended journey path**.

---

## Live Discovery Source
During actual travel, the app continuously receives:

- commuter live latitude
- commuter live longitude
- optionally heading / speed

This live location becomes the **active discovery context**.

---

# Discovery Mode Decision Logic

The backend should dynamically determine whether the commuter is:

- **on-route**
- or **off-route**

before deciding how parcel discovery should work.

---

## Discovery Mode Decision Rules

### Use Route-Based Mode if:
- commuter is within a configured distance from the saved route polyline
- commuter is not strongly moving away from the route destination
- commuter is not significantly reversed from the expected direction

### Use Nearby Fallback Mode if:
- commuter is far outside the route buffer
- commuter is clearly moving away from the route flow
- commuter has deviated beyond acceptable thresholds

---

# Suggested Threshold Rules

These values should be configurable:

## Route Buffer Threshold
Defines how close the commuter must remain to the planned route.

Example:
- `routeBufferMeters = 500`

If commuter is more than 500m away from the route line, treat as potentially off-route.

---

## Direction Mismatch Threshold
Used to determine whether the commuter is moving generally toward the route destination.

Example:
- `directionAngleThreshold = 90`

If the commuter’s live movement direction differs too much from the route direction, lower confidence in route mode.

---

## Off-Route Confidence Rule
Recommended logic:

Switch to **Nearby Fallback Mode** if:

- distance from route > threshold
**OR**
- direction mismatch > threshold
**OR**
- route alignment confidence is too low

---

# Backend Architecture Plan

# Main Endpoint

## `GET /driver/available-for-driver`

This endpoint will return parcel discovery results based on the commuter’s **current discovery mode**.

---

## Recommended Query Parameters

```ts
currentLat
currentLng
radiusMeters
limit
offset