import { Injectable, Logger } from '@nestjs/common';
import { VendorRepository } from '../repositories/vendor.repository';
import { CreateVendorDto, UpdateVendorDto, VendorResponseDto } from '../dto/vendor/vendor.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class VendorService {
  private readonly logger = new Logger(VendorService.name);

  constructor(private readonly vendorRepository: VendorRepository) {}

  async create(createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    this.logger.log('Creating new vendor', { email: createVendorDto.email });

    // Check if email already exists
    const existingEmail = await this.vendorRepository.checkEmailExists(createVendorDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if mobile already exists
    const existingMobile = await this.vendorRepository.checkMobileExists(createVendorDto.mobile);
    if (existingMobile) {
      throw new ConflictException('Mobile number already exists');
    }

    // Validate location coordinates
    if (createVendorDto.location.latitude < -90 || createVendorDto.location.latitude > 90) {
      throw new ValidationException('Invalid latitude. Must be between -90 and 90');
    }
    if (createVendorDto.location.longitude < -180 || createVendorDto.location.longitude > 180) {
      throw new ValidationException('Invalid longitude. Must be between -180 and 180');
    }

    // Create vendor
    const vendorData: any = {
      ...createVendorDto,
      email: createVendorDto.email.toLowerCase(),
    };

    // Convert registrationDate string to Date if provided
    if (vendorData.businessInfo?.registrationDate) {
      vendorData.businessInfo.registrationDate = new Date(vendorData.businessInfo.registrationDate);
    }

    const vendor = await this.vendorRepository.create(vendorData);

    this.logger.log('Vendor created successfully', { id: vendor._id });

    return this.mapToResponseDto(vendor);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching vendors with pagination', { pagination, filters });

    const result = await this.vendorRepository.findVendorsWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(vendor => this.mapToResponseDto(vendor))
    };
  }

  async findOne(id: string): Promise<VendorResponseDto> {
    this.logger.log('Fetching vendor by id', { id });

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.mapToResponseDto(vendor);
  }

  async findByEmail(email: string): Promise<VendorResponseDto> {
    this.logger.log('Fetching vendor by email', { email });

    const vendor = await this.vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.mapToResponseDto(vendor);
  }

  async findByMobile(mobile: string): Promise<VendorResponseDto> {
    this.logger.log('Fetching vendor by mobile', { mobile });

    const vendor = await this.vendorRepository.findByMobile(mobile);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.mapToResponseDto(vendor);
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto> {
    this.logger.log('Updating vendor', { id });

    const existingVendor = await this.vendorRepository.findById(id);
    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Check email uniqueness if email is being updated
    if (updateVendorDto.email && updateVendorDto.email !== existingVendor.email) {
      const emailExists = await this.vendorRepository.checkEmailExists(updateVendorDto.email, id);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
      updateVendorDto.email = updateVendorDto.email.toLowerCase();
    }

    // Check mobile uniqueness if mobile is being updated
    if (updateVendorDto.mobile && updateVendorDto.mobile !== existingVendor.mobile) {
      const mobileExists = await this.vendorRepository.checkMobileExists(updateVendorDto.mobile, id);
      if (mobileExists) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    // Validate location coordinates if being updated
    if (updateVendorDto.location) {
      if (updateVendorDto.location.latitude < -90 || updateVendorDto.location.latitude > 90) {
        throw new ValidationException('Invalid latitude. Must be between -90 and 90');
      }
      if (updateVendorDto.location.longitude < -180 || updateVendorDto.location.longitude > 180) {
        throw new ValidationException('Invalid longitude. Must be between -180 and 180');
      }
    }

    const updateData: any = {
      ...updateVendorDto,
      updatedAt: new Date(),
    };

    // Convert registrationDate string to Date if being updated
    if (updateData.businessInfo?.registrationDate) {
      updateData.businessInfo.registrationDate = new Date(updateData.businessInfo.registrationDate);
    }

    const updatedVendor = await this.vendorRepository.updateById(id, updateData);

    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }

    this.logger.log('Vendor updated successfully', { id });

    return this.mapToResponseDto(updatedVendor);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting vendor', { id });

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Soft delete
    await this.vendorRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Vendor deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching vendor statistics');

    const stats = await this.vendorRepository.getVendorStats();
    return ResponseUtil.success(stats, 'Vendor statistics retrieved successfully');
  }

  async findVendorsByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<VendorResponseDto[]> {
    this.logger.log('Fetching vendors by location', { latitude, longitude, radiusKm });

    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      throw new ValidationException('Invalid latitude. Must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new ValidationException('Invalid longitude. Must be between -180 and 180');
    }

    const vendors = await this.vendorRepository.findVendorsByLocation(latitude, longitude, radiusKm);
    return vendors.map(vendor => this.mapToResponseDto(vendor));
  }

  async findVendorsByCity(city: string): Promise<VendorResponseDto[]> {
    this.logger.log('Fetching vendors by city', { city });

    const vendors = await this.vendorRepository.findVendorsByCity(city);
    return vendors.map(vendor => this.mapToResponseDto(vendor));
  }

  async findVendorsByState(state: string): Promise<VendorResponseDto[]> {
    this.logger.log('Fetching vendors by state', { state });

    const vendors = await this.vendorRepository.findVendorsByState(state);
    return vendors.map(vendor => this.mapToResponseDto(vendor));
  }

  async findVendorsByTags(tags: string[]): Promise<VendorResponseDto[]> {
    this.logger.log('Fetching vendors by tags', { tags });

    const vendors = await this.vendorRepository.findVendorsByTags(tags);
    return vendors.map(vendor => this.mapToResponseDto(vendor));
  }

  async updateEmailVerification(id: string, isVerified: boolean): Promise<VendorResponseDto> {
    this.logger.log('Updating vendor email verification', { id, isVerified });

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updatedVendor = await this.vendorRepository.updateEmailVerificationStatus(id, isVerified);
    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }

    this.logger.log('Vendor email verification updated successfully', { id, isVerified });

    return this.mapToResponseDto(updatedVendor);
  }

  async updateMobileVerification(id: string, isVerified: boolean): Promise<VendorResponseDto> {
    this.logger.log('Updating vendor mobile verification', { id, isVerified });

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updatedVendor = await this.vendorRepository.updateMobileVerificationStatus(id, isVerified);
    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }

    this.logger.log('Vendor mobile verification updated successfully', { id, isVerified });

    return this.mapToResponseDto(updatedVendor);
  }

  async updateStatus(id: string, status: string): Promise<VendorResponseDto> {
    this.logger.log('Updating vendor status', { id, status });

    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updatedVendor = await this.vendorRepository.updateStatus(id, status);
    if (!updatedVendor) {
      throw new NotFoundException('Vendor not found');
    }

    this.logger.log('Vendor status updated successfully', { id, status });

    return this.mapToResponseDto(updatedVendor);
  }

  private mapToResponseDto(vendor: any): VendorResponseDto {
    return {
      id: vendor._id.toString(),
      name: vendor.name,
      email: vendor.email,
      mobile: vendor.mobile,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      pincode: vendor.pincode,
      location: vendor.location,
      isEmailVerified: vendor.isEmailVerified,
      isMobileVerified: vendor.isMobileVerified,
      profileImage: vendor.profileImage,
      businessInfo: vendor.businessInfo,
      contactInfo: vendor.contactInfo,
      status: vendor.status,
      preferences: vendor.preferences,
      tags: vendor.tags,
      isActive: vendor.isActive,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    };
  }
}
