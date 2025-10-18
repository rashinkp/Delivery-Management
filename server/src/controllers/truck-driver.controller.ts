import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TruckDriverService } from '../services/truck-driver.service';
import { CreateTruckDriverDto, UpdateTruckDriverDto } from '../dto/truck-driver/truck-driver.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOnly, AdminOrTruckDriver } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('truck-drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TruckDriverController {
  constructor(private readonly truckDriverService: TruckDriverService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AdminOnly()
  async create(@Body() createTruckDriverDto: CreateTruckDriverDto): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.create(createTruckDriverDto);
    return ResponseUtil.created(truckDriver, 'Truck driver created successfully');
  }

  @Get()
  @AdminOnly()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('isLicenseValid') isLicenseValid?: boolean,
    @Query('isMobileVerified') isMobileVerified?: boolean,
    @Query('isActive') isActive?: boolean,
    @Query('city') city?: string,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      status,
      isLicenseValid,
      isMobileVerified,
      isActive,
      city,
    };

    const result = await this.truckDriverService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Truck drivers retrieved successfully');
  }

  @Get('stats')
  @AdminOnly()
  async getStats(): Promise<ApiResponse<any>> {
    return await this.truckDriverService.getStats();
  }

  @Get('available')
  @AdminOnly()
  async findAvailableDrivers(): Promise<ApiResponse<any>> {
    const drivers = await this.truckDriverService.findAvailableDrivers();
    return ResponseUtil.success(drivers, 'Available truck drivers retrieved successfully');
  }

  @Get('near-location')
  async findDriversNearLocation(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radiusKm') radiusKm: number = 10,
  ): Promise<ApiResponse<any>> {
    const drivers = await this.truckDriverService.findDriversNearLocation(
      latitude,
      longitude,
      radiusKm,
    );
    return ResponseUtil.success(drivers, 'Nearby truck drivers retrieved successfully');
  }

  @Get('expiring-licenses')
  async findDriversWithExpiringLicenses(
    @Query('daysBeforeExpiry') daysBeforeExpiry: number = 30,
  ): Promise<ApiResponse<any>> {
    const drivers = await this.truckDriverService.findDriversWithExpiringLicenses(daysBeforeExpiry);
    return ResponseUtil.success(drivers, 'Truck drivers with expiring licenses retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.findOne(id);
    return ResponseUtil.success(truckDriver, 'Truck driver retrieved successfully');
  }

  @Get('mobile/:mobile')
  async findByMobile(@Param('mobile') mobile: string): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.findByMobile(mobile);
    return ResponseUtil.success(truckDriver, 'Truck driver retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.update(id, updateTruckDriverDto);
    return ResponseUtil.updated(truckDriver, 'Truck driver updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.truckDriverService.remove(id);
  }

  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body() location: { latitude: number; longitude: number; address: string },
  ): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.updateLocation(id, location);
    return ResponseUtil.updated(truckDriver, 'Truck driver location updated successfully');
  }

  @Patch(':id/status')
  @AdminOnly()
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.updateStatus(id, body.status);
    return ResponseUtil.updated(truckDriver, 'Truck driver status updated successfully');
  }

  @Get('profile')
  @AdminOrTruckDriver()
  async getProfile(@CurrentUser() user: CurrentUserData): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.findOne(user.id);
    return ResponseUtil.success(truckDriver, 'Profile retrieved successfully');
  }

  @Patch('profile')
  @AdminOrTruckDriver()
  async updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<ApiResponse<any>> {
    const truckDriver = await this.truckDriverService.update(user.id, updateTruckDriverDto);
    return ResponseUtil.updated(truckDriver, 'Profile updated successfully');
  }
}
