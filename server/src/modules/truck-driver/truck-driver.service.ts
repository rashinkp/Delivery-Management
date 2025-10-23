import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { ITruckDriverRepository } from './interfaces/truck-driver.repository.interface';
import { ITruckDriverService } from './interfaces/truck-driver.service.interface';
import { CreateTruckDriverDto } from './dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from './dto/update-truck-driver.dto';
import { TruckDriver } from 'src/schemas/truck-driver.schema';

@Injectable()
export class TruckDriverService implements ITruckDriverService {
  constructor(
    @Inject('ITruckDriverRepository')
    private readonly truckDriverRepository: ITruckDriverRepository,
  ) {}

  async create(
    createTruckDriverDto: CreateTruckDriverDto,
  ): Promise<TruckDriver> {
    // Check if mobile number already exists
    const existingDriverByMobile =
      await this.truckDriverRepository.findByMobile(
        createTruckDriverDto.mobile,
      );
    if (existingDriverByMobile) {
      throw new ConflictException(
        'Driver with this mobile number already exists',
      );
    }

    // Check if license number already exists
    const existingDriverByLicense =
      await this.truckDriverRepository.findByLicenseNumber(
        createTruckDriverDto.licenseNumber,
      );
    if (existingDriverByLicense) {
      throw new ConflictException(
        'Driver with this license number already exists',
      );
    }

    return this.truckDriverRepository.create(createTruckDriverDto);
  }

  async findAll(): Promise<TruckDriver[]> {
    return this.truckDriverRepository.findAll();
  }

  async findById(id: string): Promise<TruckDriver> {
    const driver = await this.truckDriverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }
    return driver;
  }

  async update(
    id: string,
    updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<TruckDriver> {
    const driver = await this.findById(id);

    // Check if mobile number is being updated and if it already exists
    if (
      updateTruckDriverDto.mobile &&
      updateTruckDriverDto.mobile !== driver.mobile
    ) {
      const existingDriverByMobile =
        await this.truckDriverRepository.findByMobile(
          updateTruckDriverDto.mobile,
        );
      if (existingDriverByMobile) {
        throw new ConflictException(
          'Driver with this mobile number already exists',
        );
      }
    }

    // Check if license number is being updated and if it already exists
    if (
      updateTruckDriverDto.licenseNumber &&
      updateTruckDriverDto.licenseNumber !== driver.licenseNumber
    ) {
      const existingDriverByLicense =
        await this.truckDriverRepository.findByLicenseNumber(
          updateTruckDriverDto.licenseNumber,
        );
      if (existingDriverByLicense) {
        throw new ConflictException(
          'Driver with this license number already exists',
        );
      }
    }

    return this.truckDriverRepository.update(id, updateTruckDriverDto);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findById(id);
    const deleted = await this.truckDriverRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete truck driver');
    }
  }

  async findByStatus(status: string): Promise<TruckDriver[]> {
    return this.truckDriverRepository.findByStatus(status);
  }

  async findByMobile(mobile: string): Promise<TruckDriver> {
    const driver = await this.truckDriverRepository.findByMobile(mobile);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }
    return driver;
  }
}
