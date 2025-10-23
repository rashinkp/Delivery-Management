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
import { TruckDriverResponseDto } from './dto/truck-driver-response.dto';
import { TruckDriverMapper } from './mappers/truck-driver.mapper';

@Injectable()
export class TruckDriverService implements ITruckDriverService {
  constructor(
    @Inject('ITruckDriverRepository')
    private readonly truckDriverRepository: ITruckDriverRepository,
  ) {}

  async create(
    createTruckDriverDto: CreateTruckDriverDto,
  ): Promise<TruckDriverResponseDto> {
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

    const driver = await this.truckDriverRepository.create(createTruckDriverDto);
    return TruckDriverMapper.toResponseDto(driver);
  }

  async findAll(): Promise<TruckDriverResponseDto[]> {
    const drivers = await this.truckDriverRepository.findAll();
    return TruckDriverMapper.toResponseDtoList(drivers);
  }

  async findById(id: string): Promise<TruckDriverResponseDto> {
    const driver = await this.truckDriverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }
    return TruckDriverMapper.toResponseDto(driver);
  }

  async update(
    id: string,
    updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<TruckDriverResponseDto> {
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

    const updatedDriver = await this.truckDriverRepository.update(id, updateTruckDriverDto);
    return TruckDriverMapper.toResponseDto(updatedDriver);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findById(id);
    const deleted = await this.truckDriverRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Failed to delete truck driver');
    }
  }

  async findByStatus(status: string): Promise<TruckDriverResponseDto[]> {
    const drivers = await this.truckDriverRepository.findByStatus(status);
    return TruckDriverMapper.toResponseDtoList(drivers);
  }

  async findByMobile(mobile: string): Promise<TruckDriverResponseDto> {
    const driver = await this.truckDriverRepository.findByMobile(mobile);
    if (!driver) {
      throw new NotFoundException('Truck driver not found');
    }
    return TruckDriverMapper.toResponseDto(driver);
  }
}
