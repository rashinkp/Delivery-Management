import { VendorDocument } from '../../../schemas/vendor.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface IVendorRepository extends BaseRepositoryInterface<VendorDocument> {
  // Vendor-specific methods
  findByEmail(email: string): Promise<VendorDocument | null>;
  findByMobile(mobile: string): Promise<VendorDocument | null>;
  checkEmailExists(email: string, excludeId?: string): Promise<boolean>;
  checkMobileExists(mobile: string, excludeId?: string): Promise<boolean>;
  findByCity(city: string): Promise<VendorDocument[]>;
  findByState(state: string): Promise<VendorDocument[]>;
  findByStatus(status: string): Promise<VendorDocument[]>;
  searchVendors(query: string): Promise<VendorDocument[]>;
  findByLocation(latitude: number, longitude: number, radius: number): Promise<VendorDocument[]>;
  updateLocation(vendorId: string, location: { latitude: number; longitude: number; address: string }): Promise<VendorDocument | null>;
  updateStatus(vendorId: string, status: string): Promise<VendorDocument | null>;
}
