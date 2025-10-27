import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import type { ITruckDriverRepository } from './interfaces/truck-driver.repository.interface';
import { ITruckDriverService } from './interfaces/truck-driver.service.interface';
import { CreateTruckDriverDto } from './dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from './dto/update-truck-driver.dto';
import { TruckDriverResponseDto } from './dto/truck-driver-response.dto';
import { TruckDriverQueryDto } from './dto/truck-driver-query.dto';
import { PaginatedTruckDriverResponseDto } from './dto/paginated-truck-driver-response.dto';
import { TruckDriverMapper } from './mappers/truck-driver.mapper';
import { JwtService } from '@nestjs/jwt';
import { LoginTruckDriverDto } from './dto/login-truck-driver.dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class TruckDriverService implements ITruckDriverService {
  constructor(
    @Inject('ITruckDriverRepository')
    private readonly truckDriverRepository: ITruckDriverRepository,
    private readonly jwtService: JwtService,
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

    createTruckDriverDto.password = await bcrypt.hash(
      createTruckDriverDto.password,
      10,
    );

    const driver =
      await this.truckDriverRepository.create(createTruckDriverDto);
    return TruckDriverMapper.toResponseDto(driver);
  }

  async findAll(): Promise<TruckDriverResponseDto[]> {
    const drivers = await this.truckDriverRepository.findAll();
    return TruckDriverMapper.toResponseDtoList(drivers);
  }

  async findWithPagination(query: TruckDriverQueryDto): Promise<PaginatedTruckDriverResponseDto> {
    const result = await this.truckDriverRepository.findWithPagination(query);
    return {
      data: TruckDriverMapper.toResponseDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrev: result.hasPrev,
    };
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

    if (updateTruckDriverDto.password) {
      updateTruckDriverDto.password = await bcrypt.hash(
        updateTruckDriverDto.password,
        10,
      );
    } 

    const updatedDriver = await this.truckDriverRepository.update(
      id,
      updateTruckDriverDto,
    );
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

  async login(loginDto: LoginTruckDriverDto): Promise<{ token: string }> {
    const driver = await this.truckDriverRepository.findByMobile(loginDto.mobile);
    if (!driver) throw new UnauthorizedException('Invalid mobile or password');
    console.log(driver);

    const isMatch = await bcrypt.compare(loginDto.password, driver.password);
    if (!isMatch) throw new UnauthorizedException('Invalid mobile or password');

    const payload = { sub: driver._id, mobile: driver.mobile, role: 'driver' };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
