import { CreateVendorDto, UpdateVendorDto, VendorResponseDto } from '../../../dto/vendor/vendor.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface IVendorService {
  // CRUD operations
  createVendor(createVendorDto: CreateVendorDto): Promise<VendorResponseDto>;
  findAllVendors(paginationDto: PaginationDto): Promise<{ data: VendorResponseDto[]; total: number; page: number; limit: number }>;
  findVendorById(id: string): Promise<VendorResponseDto>;
  updateVendor(id: string, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto>;
  deleteVendor(id: string): Promise<void>;

  // Business logic
  updateLocation(vendorId: string, location: { latitude: number; longitude: number; address: string }): Promise<VendorResponseDto>;
  updateStatus(vendorId: string, status: string): Promise<VendorResponseDto>;
  getVendorsByCity(city: string): Promise<VendorResponseDto[]>;
  getVendorsByState(state: string): Promise<VendorResponseDto[]>;
  getVendorsByStatus(status: string): Promise<VendorResponseDto[]>;
  searchVendors(query: string): Promise<VendorResponseDto[]>;

  // Utility methods
  checkEmailExists(email: string, excludeId?: string): Promise<boolean>;
  checkMobileExists(mobile: string, excludeId?: string): Promise<boolean>;
  findByEmail(email: string): Promise<VendorResponseDto | null>;
  findByMobile(mobile: string): Promise<VendorResponseDto | null>;
  findByLocation(latitude: number, longitude: number, radius: number): Promise<VendorResponseDto[]>;
}
