import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { IVendorRepository } from '../../interfaces/vendor.repository.interface';
import { IVendorService } from '../../interfaces/vendor.service.interface';
import { CreateVendorDto } from '../../dto/create-vendor.dto';
import { UpdateVendorDto } from '../../dto/update-vendor.dto';
import { Vendor } from 'src/schemas/vendor.schema';
@Injectable()
export class VendorService implements IVendorService {
  constructor(
    @Inject('IVendorRepository')
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if email already exists
    const existingVendorByEmail = await this.vendorRepository.findByEmail(
      createVendorDto.email,
    );
    if (existingVendorByEmail) {
      throw new ConflictException('Vendor with this email already exists');
    }

    // Check if contact number already exists
    const existingVendorByContact = await this.vendorRepository.findByContactNumber(
      createVendorDto.contactNumber,
    );
    if (existingVendorByContact) {
      throw new ConflictException('Vendor with this contact number already exists');
    }

    return this.vendorRepository.create(createVendorDto);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.findAll();
  }

  async findById(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
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
      const existingVendorByContact = await this.vendorRepository.findByContactNumber(
        updateVendorDto.contactNumber,
      );
      if (existingVendorByContact) {
        throw new ConflictException('Vendor with this contact number already exists');
      }
    }

    return this.vendorRepository.update(id, updateVendorDto);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findById(id);
    const deleted = await this.vendorRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete vendor');
    }
  }

  async findByEmail(email: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByContactNumber(contactNumber: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findByContactNumber(contactNumber);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return vendor;
  }

  async findByLocation(location: string): Promise<Vendor[]> {
    return this.vendorRepository.findByLocation(location);
  }
}
