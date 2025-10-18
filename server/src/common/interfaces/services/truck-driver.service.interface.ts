import { CreateTruckDriverDto, UpdateTruckDriverDto, TruckDriverResponseDto } from '../../../dto/truck-driver/truck-driver.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface ITruckDriverService {
  // CRUD operations
  createTruckDriver(createTruckDriverDto: CreateTruckDriverDto): Promise<TruckDriverResponseDto>;
  findAllTruckDrivers(paginationDto: PaginationDto): Promise<{ data: TruckDriverResponseDto[]; total: number; page: number; limit: number }>;
  findTruckDriverById(id: string): Promise<TruckDriverResponseDto>;
  updateTruckDriver(id: string, updateTruckDriverDto: UpdateTruckDriverDto): Promise<TruckDriverResponseDto>;
  deleteTruckDriver(id: string): Promise<void>;

  // Authentication
  validateCredentials(mobile: string, password: string): Promise<TruckDriverResponseDto>;
  updateLastLogin(driverId: string): Promise<void>;

  // Business logic
  updateLocation(driverId: string, location: { latitude: number; longitude: number; address: string }): Promise<TruckDriverResponseDto>;
  updateStatus(driverId: string, status: string): Promise<TruckDriverResponseDto>;
  getAvailableDrivers(): Promise<TruckDriverResponseDto[]>;
  getDriversByStatus(status: string): Promise<TruckDriverResponseDto[]>;

  // Utility methods
  checkMobileExists(mobile: string, excludeId?: string): Promise<boolean>;
  checkLicenseExists(license: string, excludeId?: string): Promise<boolean>;
  findByMobile(mobile: string): Promise<TruckDriverResponseDto | null>;
  findByLicense(license: string): Promise<TruckDriverResponseDto | null>;
}
