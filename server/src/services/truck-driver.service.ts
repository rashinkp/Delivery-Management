import { Injectable, Logger } from '@nestjs/common';
import { TruckDriverRepository } from '../repositories/truck-driver.repository';
import { CreateTruckDriverDto, UpdateTruckDriverDto, TruckDriverResponseDto } from '../dto/truck-driver/truck-driver.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TruckDriverService {
  private readonly logger = new Logger(TruckDriverService.name);

  constructor(private readonly truckDriverRepository: TruckDriverRepository) {}

  async create(createTruckDriverDto: CreateTruckDriverDto): Promise<TruckDriverResponseDto> {
    this.logger.log('Creating new truck driver', { mobile: createTruckDriverDto.mobile });

    // Check if mobile already exists
    const existingMobile = await this.truckDriverRepository.checkMobileExists(createTruckDriverDto.mobile);
    if (existingMobile) {
      throw new ConflictException('Mobile number already exists');
    }

    // Check if driving license already exists
    const existingLicense = await this.truckDriverRepository.checkLicenseExists(createTruckDriverDto.drivingLicense);
    if (existingLicense) {
      throw new ConflictException('Driving license already exists');
    }

    // Validate license expiry date
    const licenseExpiryDate = new Date(createTruckDriverDto.licenseExpiryDate);
    if (licenseExpiryDate <= new Date()) {
      throw new ValidationException('License expiry date must be in the future');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createTruckDriverDto.password, 12);

    // Create truck driver
    const truckDriver = await this.truckDriverRepository.create({
      ...createTruckDriverDto,
      password: hashedPassword,
      licenseExpiryDate,
      isLicenseValid: licenseExpiryDate > new Date(),
    });

    this.logger.log('Truck driver created successfully', { id: truckDriver._id });

    return this.mapToResponseDto(truckDriver);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching truck drivers with pagination', { pagination, filters });

    const result = await this.truckDriverRepository.findDriversWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(driver => this.mapToResponseDto(driver))
    };
  }

  async findOne(id: string): Promise<TruckDriverResponseDto> {
    this.logger.log('Fetching truck driver by id', { id });

    const truckDriver = await this.truckDriverRepository.findById(id);
    if (!truckDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    return this.mapToResponseDto(truckDriver);
  }

  async findByMobile(mobile: string): Promise<TruckDriverResponseDto> {
    this.logger.log('Fetching truck driver by mobile', { mobile });

    const truckDriver = await this.truckDriverRepository.findByMobile(mobile);
    if (!truckDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    return this.mapToResponseDto(truckDriver);
  }

  async update(id: string, updateTruckDriverDto: UpdateTruckDriverDto): Promise<TruckDriverResponseDto> {
    this.logger.log('Updating truck driver', { id });

    const existingDriver = await this.truckDriverRepository.findById(id);
    if (!existingDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    // Check mobile uniqueness if mobile is being updated
    if (updateTruckDriverDto.mobile && updateTruckDriverDto.mobile !== existingDriver.mobile) {
      const mobileExists = await this.truckDriverRepository.checkMobileExists(updateTruckDriverDto.mobile, id);
      if (mobileExists) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    // Check license uniqueness if license is being updated
    if (updateTruckDriverDto.drivingLicense && updateTruckDriverDto.drivingLicense !== existingDriver.drivingLicense) {
      const licenseExists = await this.truckDriverRepository.checkLicenseExists(updateTruckDriverDto.drivingLicense, id);
      if (licenseExists) {
        throw new ConflictException('Driving license already exists');
      }
    }

    // Validate license expiry date if being updated
    if (updateTruckDriverDto.licenseExpiryDate) {
      const licenseExpiryDate = new Date(updateTruckDriverDto.licenseExpiryDate);
      if (licenseExpiryDate <= new Date()) {
        throw new ValidationException('License expiry date must be in the future');
      }
      updateTruckDriverDto.isLicenseValid = licenseExpiryDate > new Date();
    }

    const updatedDriver = await this.truckDriverRepository.updateById(id, {
      ...updateTruckDriverDto,
      updatedAt: new Date(),
    });

    if (!updatedDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    this.logger.log('Truck driver updated successfully', { id });

    return this.mapToResponseDto(updatedDriver);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting truck driver', { id });

    const truckDriver = await this.truckDriverRepository.findById(id);
    if (!truckDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    // Soft delete
    await this.truckDriverRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Truck driver deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching truck driver statistics');

    const stats = await this.truckDriverRepository.getDriverStats();
    return ResponseUtil.success(stats, 'Truck driver statistics retrieved successfully');
  }

  async findAvailableDrivers(): Promise<TruckDriverResponseDto[]> {
    this.logger.log('Fetching available truck drivers');

    const drivers = await this.truckDriverRepository.findAvailableDrivers();
    return drivers.map(driver => this.mapToResponseDto(driver));
  }

  async findDriversNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<TruckDriverResponseDto[]> {
    this.logger.log('Fetching truck drivers near location', { latitude, longitude, radiusKm });

    const drivers = await this.truckDriverRepository.findDriversNearLocation(latitude, longitude, radiusKm);
    return drivers.map(driver => this.mapToResponseDto(driver));
  }

  async updateLocation(
    id: string,
    location: { latitude: number; longitude: number; address: string }
  ): Promise<TruckDriverResponseDto> {
    this.logger.log('Updating truck driver location', { id, location });

    const driver = await this.truckDriverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }

    const updatedDriver = await this.truckDriverRepository.updateLocation(id, location);
    if (!updatedDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    this.logger.log('Truck driver location updated successfully', { id });

    return this.mapToResponseDto(updatedDriver);
  }

  async updateStatus(id: string, status: string): Promise<TruckDriverResponseDto> {
    this.logger.log('Updating truck driver status', { id, status });

    const driver = await this.truckDriverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }

    const updatedDriver = await this.truckDriverRepository.updateStatus(id, status);
    if (!updatedDriver) {
      throw new NotFoundException('Truck driver not found');
    }

    this.logger.log('Truck driver status updated successfully', { id, status });

    return this.mapToResponseDto(updatedDriver);
  }

  async validateCredentials(mobile: string, password: string): Promise<TruckDriverResponseDto> {
    this.logger.log('Validating truck driver credentials', { mobile });

    const driver = await this.truckDriverRepository.findByMobile(mobile);
    if (!driver) {
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    // Update last login
    await this.truckDriverRepository.updateLastLogin(driver._id.toString());

    this.logger.log('Truck driver credentials validated successfully', { id: driver._id });

    return this.mapToResponseDto(driver);
  }

  async findDriversWithExpiringLicenses(daysBeforeExpiry: number = 30): Promise<TruckDriverResponseDto[]> {
    this.logger.log('Fetching truck drivers with expiring licenses', { daysBeforeExpiry });

    const drivers = await this.truckDriverRepository.findDriversWithExpiringLicenses(daysBeforeExpiry);
    return drivers.map(driver => this.mapToResponseDto(driver));
  }

  private mapToResponseDto(driver: any): TruckDriverResponseDto {
    return {
      id: driver._id.toString(),
      name: driver.name,
      mobile: driver.mobile,
      role: driver.role,
      address: driver.address,
      drivingLicense: driver.drivingLicense,
      licenseExpiryDate: driver.licenseExpiryDate,
      isMobileVerified: driver.isMobileVerified,
      isLicenseValid: driver.isLicenseValid,
      lastLoginAt: driver.lastLoginAt,
      profileImage: driver.profileImage,
      vehicleInfo: driver.vehicleInfo,
      location: driver.location,
      status: driver.status,
      preferences: driver.preferences,
      isActive: driver.isActive,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
