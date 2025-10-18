import { TruckDriverDocument } from '../../../schemas/truck-driver.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface ITruckDriverRepository extends BaseRepositoryInterface<TruckDriverDocument> {
  // Truck driver-specific methods
  findByMobile(mobile: string): Promise<TruckDriverDocument | null>;
  findByDrivingLicense(license: string): Promise<TruckDriverDocument | null>;
  checkMobileExists(mobile: string, excludeId?: string): Promise<boolean>;
  checkLicenseExists(license: string, excludeId?: string): Promise<boolean>;
  updateLastLogin(driverId: string): Promise<TruckDriverDocument | null>;
  findByStatus(status: string): Promise<TruckDriverDocument[]>;
  getAvailableDrivers(): Promise<TruckDriverDocument[]>;
  updateLocation(driverId: string, location: { latitude: number; longitude: number; address: string; lastUpdated: Date }): Promise<TruckDriverDocument | null>;
  updateStatus(driverId: string, status: string): Promise<TruckDriverDocument | null>;
  findByLocation(latitude: number, longitude: number, radius: number): Promise<TruckDriverDocument[]>;
}
