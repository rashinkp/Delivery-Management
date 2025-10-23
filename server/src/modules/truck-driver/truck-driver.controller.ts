import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTruckDriverDto } from './dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from './dto/update-truck-driver.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { ITruckDriverService } from './interfaces/truck-driver.service.interface';

@Controller('truck-drivers')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TruckDriverController {
  constructor(
    @Inject('ITruckDriverService')
    private readonly truckDriverService: ITruckDriverService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTruckDriverDto: CreateTruckDriverDto): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.create(createTruckDriverDto);
      return ApiResponseDto.success(driver, 'Truck driver created successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to create truck driver', error.message);
    }
  }

  @Get()
  async findAll(): Promise<ApiResponseDto<any>> {
    try {
      const drivers = await this.truckDriverService.findAll();
      return ApiResponseDto.success(drivers, 'Truck drivers retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve truck drivers', error.message);
    }
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<ApiResponseDto<any>> {
    try {
      const drivers = await this.truckDriverService.findByStatus(status);
      return ApiResponseDto.success(drivers, 'Truck drivers retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve truck drivers', error.message);
    }
  }

  @Get('mobile/:mobile')
  async findByMobile(@Param('mobile') mobile: string): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.findByMobile(mobile);
      return ApiResponseDto.success(driver, 'Truck driver retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve truck driver', error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.findById(id);
      return ApiResponseDto.success(driver, 'Truck driver retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve truck driver', error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.update(id, updateTruckDriverDto);
      return ApiResponseDto.success(driver, 'Truck driver updated successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to update truck driver', error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      await this.truckDriverService.remove(id);
      return ApiResponseDto.success(null, 'Truck driver deleted successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to delete truck driver', error.message);
    }
  }
}
