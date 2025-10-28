import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { IVendorRepository } from './interfaces/vendor.repository.interface';
import { IVendorService } from './interfaces/vendor.service.interface';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorMapper } from './mappers/vendor.mapper';
import { VendorQueryDto } from './dto/vendor-query.dto';
@Injectable()
export class VendorService implements IVendorService {
  constructor(
    @Inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    // Check if email already exists
    const existingVendorByEmail = await this.vendorRepository.findByEmail(
      createVendorDto.email,
    );
    if (existingVendorByEmail) {
      throw new ConflictException('Vendor with this email already exists');
    }

    // Check if contact number already exists
    const existingVendorByContact =
      await this.vendorRepository.findByContactNumber(
        createVendorDto.contactNumber,
      );
    if (existingVendorByContact) {
      throw new ConflictException(
        'Vendor with this contact number already exists',
      );
    }

    const vendor = await this.vendorRepository.create(createVendorDto);
    return VendorMapper.toResponseDto(vendor);
  }

  async findAll(): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorRepository.findAll();
    return VendorMapper.toResponseDtoList(vendors);
  }

  async findWithPagination(query: VendorQueryDto): Promise<{
    data: VendorResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const result = await this.vendorRepository.findWithPagination(query);
    return {
      ...result,
      data: VendorMapper.toResponseDtoList(result.data as any),
    };
  }

  async findById(id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return VendorMapper.toResponseDto(vendor);
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto> {
    const vendor = await this.findById(id);

    // Check if email is being updated and if it already exists
    if (updateVendorDto.email && updateVendorDto.email !== vendor.email) {
      const existingVendorByEmail = await this.vendorRepository.findByEmail(
        updateVendorDto.email,
      );
      if (existingVendorByEmail) {
        throw new ConflictException('Vendor with this email already exists');
      }
    }

    // Check if contact number is being updated and if it already exists
    if (
      updateVendorDto.contactNumber &&
      updateVendorDto.contactNumber !== vendor.contactNumber
    ) {
      const existingVendorByContact =
        await this.vendorRepository.findByContactNumber(
          updateVendorDto.contactNumber,
        );
      if (existingVendorByContact) {
        throw new ConflictException(
          'Vendor with this contact number already exists',
        );
      }
    }

    const updatedVendor = await this.vendorRepository.update(id, updateVendorDto);
    return VendorMapper.toResponseDto(updatedVendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findById(id);
    const deleted = await this.vendorRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete vendor');
    }
  }

  async findByEmail(email: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return VendorMapper.toResponseDto(vendor);
  }

  async findByContactNumber(contactNumber: string): Promise<VendorResponseDto> {
    const vendor =
      await this.vendorRepository.findByContactNumber(contactNumber);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return VendorMapper.toResponseDto(vendor);
  }

  async findByLocation(location: string): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorRepository.findByLocation(location);
    return VendorMapper.toResponseDtoList(vendors);
  }
}
