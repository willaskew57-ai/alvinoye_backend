import type { IUpdateLocation, TDriverLocation, ILocationHistory } from './track-driver.interface';
export declare const TrackDriverServices: {
    updateDriverLocationInDB: (payload: IUpdateLocation) => Promise<TDriverLocation>;
    getDriverLocationFromDB: (driverId: string) => Promise<TDriverLocation | null>;
    getLocationHistoryFromDB: (driverId: string, limit?: number) => Promise<ILocationHistory[]>;
    getParcelDriverLocationFromDB: (parcelId: string) => Promise<TDriverLocation | null>;
    markDriverOfflineInDB: (driverId: string) => Promise<TDriverLocation | null>;
    getNearbyDriversFromDB: (latitude: number, longitude: number, radiusKm?: number) => Promise<TDriverLocation[]>;
};
//# sourceMappingURL=track-driver.service.d.ts.map