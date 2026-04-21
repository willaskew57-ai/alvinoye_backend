# Available for Driver - Parcel Discovery Enhancement Plan

## Current Behavior

- Requires `currentLat` and `currentLng` (throws error if missing)
- Uses `discoveryMode` to switch between 'route-based' and 'nearby-fallback'
- Only shows one type of parcels based on route status

## Desired Behavior

1. Make `currentLat`/`currentLng` optional
2. If not provided → use driver's saved `from` location as current position
3. If driver ON route → show only route-based parcels
4. If driver OFF route → show BOTH route parcels AND nearby parcels
5. Combine and deduplicate results

---

## Implementation Plan

### Step 1: Modify Validation (`driver.validation.ts`)
- Make `currentLat` and `currentLng` optional in `getAvailableParcelsValidationSchema`

### Step 2: Modify Service (`driver.service.ts`)
- Update `getAvailableParcelsFromDB` function:
  - If `currentLat`/`currentLng` not provided, use driver's saved `from` location as fallback
  - Keep existing route detection logic (isOnRoute check)
  - When driver is OFF route, fetch both:
    - Route-based parcels (parcels along the driver's saved route)
    - Nearby parcels (within radius of current position)
  - Combine results and deduplicate by parcel ID
  - Update response to indicate which parcels are from which source

### Step 3: Test
- Test with currentLat/currentLng provided
- Test without currentLat/currentLng (uses from location)
- Test when driver is ON route
- Test when driver is OFF route (should show both)

---

## Files to Modify

1. `src/app/v1/modules/driver/driver.validation.ts`
2. `src/app/v1/modules/driver/driver.service.ts`

## No Route Changes Required
The controller already passes query params correctly.