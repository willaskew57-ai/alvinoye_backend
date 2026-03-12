import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import type { IUpdateLocation, TDriverLocation } from './track-driver.interface';
import { getIO } from '../../../../socket'; // Import the getIO helper
import { DriverLocation } from './track-driver.model';

/**
 * Updates driver coordinates in DB and broadcasts to the parcel room.
 */
const updateDriverLocationInDB = async (
  payload: IUpdateLocation
): Promise<TDriverLocation> => {
  const locationData = {
    driver_id: payload.driver_id,
    latitude: payload.latitude,
    longitude: payload.longitude,
    parcel_id: payload.parcel_id,
    heading: payload.heading,
    speed: payload.speed,
    accuracy: payload.accuracy,
    is_online: true,
    last_updated: new Date(),
  };

  
  const location = await DriverLocation.findOneAndUpdate(
    { driver_id: payload.driver_id },
    locationData,
    { new: true, upsert: true, runValidators: true }
  ).populate('driver_id', 'full_name phone_number profile_image');

  
  try {
    const io = getIO();

    
    io.to(`driver_${payload.driver_id}`).emit('location_updated', {
      location: location.toJSON(),
    });

    
    if (payload.parcel_id) {
      io.to(`parcel_${payload.parcel_id}`).emit('driver_location_update', {
        driver_id: payload.driver_id,
        parcel_id: payload.parcel_id,
        latitude: payload.latitude,
        longitude: payload.longitude,
        heading: payload.heading,
        speed: payload.speed,
        last_updated: location.last_updated,
      });
    }
  } catch (error) {
    console.error('Failed to emit location update via socket:', error);
  }

 
  await saveLocationHistory(payload);


  console.log(location, "Updated Location")

  return location;
};

/**
 * Retrieves the current location for a customer tracking a parcel.
 */
const getParcelDriverLocationFromDB = async (
  parcelId: string
): Promise<TDriverLocation | null> => {
  const location = await DriverLocation.findOne({
    parcel_id: parcelId,
    is_online: true,
  })
    .sort({ last_updated: -1 })
    .populate('driver_id', 'full_name phone_number profile_image')
    .populate('parcel_id', 'parcel_id parcel_name status');

  if (!location) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No active driver found for this parcel'
    );
  }

  console.log(location, "location")

  return location;
};

// Private helper to save historical movement
const saveLocationHistory = async (payload: IUpdateLocation) => {
  try {
    await DriverLocation.create({
      ...payload,
      is_online: true,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Failed to save location history:', error);
  }
};

export const TrackDriverServices = {
  updateDriverLocationInDB,
  getParcelDriverLocationFromDB,
};