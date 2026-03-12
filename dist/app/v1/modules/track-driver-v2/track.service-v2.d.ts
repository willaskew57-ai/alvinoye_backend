import type { IUpdateLocation, TDriverLocation } from './track-driver.interface';
export declare const TrackDriverServices: {
    updateDriverLocationInDB: (payload: IUpdateLocation) => Promise<TDriverLocation>;
    getParcelDriverLocationFromDB: (parcelId: string) => Promise<TDriverLocation | null>;
};
//# sourceMappingURL=track.service-v2.d.ts.map