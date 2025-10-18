import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TruckDriverService } from '../services/truck-driver.service';
import { CreateTruckDriverDto, UpdateTruckDriverDto } from '../dto/truck-driver/truck-driver.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('truck-drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TruckDriverController {
  constructor(private readonly truckDriverService: TruckDriverService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTruckDriverDto: CreateTruckDriverDto) {
    const truckDriver = await this.truckDriverService.create(createTruckDriverDto);
    return ResponseUtil.success(truckDriver, 'Truck driver created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.truckDriverService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Truck drivers retrieved successfully');
  }

  @Get('available')
  @Roles(USER_ROLES.ADMIN)
  async findAvailable() {
    const drivers = await this.truckDriverService.findAvailableDrivers();
    return ResponseUtil.success(drivers, 'Available truck drivers retrieved successfully');
  }

  @Get('near-location')
  @Roles(USER_ROLES.ADMIN)
  async findNearLocation(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 10,
  ) {
    const drivers = await this.truckDriverService.findDriversNearLocation(
      latitude,
      longitude,
      radius,
    );
    return ResponseUtil.success(drivers, 'Nearby truck drivers retrieved successfully');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.truckDriverService.getStats();
    return ResponseUtil.success(stats, 'Truck driver statistics retrieved successfully');
  }

  @Get('expiring-licenses')
  @Roles(USER_ROLES.ADMIN)
  async findExpiringLicenses(@Query('days') days: number = 30) {
    const drivers = await this.truckDriverService.findDriversWithExpiringLicenses(days);
    return ResponseUtil.success(drivers, 'Truck drivers with expiring licenses retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findOne(@Param('id') id: string) {
    const truckDriver = await this.truckDriverService.findOne(id);
    return ResponseUtil.success(truckDriver, 'Truck driver retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async update(@Param('id') id: string, @Body() updateTruckDriverDto: UpdateTruckDriverDto) {
    const truckDriver = await this.truckDriverService.update(id, updateTruckDriverDto);
    return ResponseUtil.success(truckDriver, 'Truck driver updated successfully');
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const truckDriver = await this.truckDriverService.updateStatus(id, status);
    return ResponseUtil.success(truckDriver, 'Truck driver status updated successfully');
  }

  @Patch(':id/location')
  @Roles(USER_ROLES.TRUCK_DRIVER)
  async updateLocation(
    @Param('id') id: string,
    @Body() location: { latitude: number; longitude: number; address: string },
  ) {
    const truckDriver = await this.truckDriverService.updateLocation(id, location);
    return ResponseUtil.success(truckDriver, 'Truck driver location updated successfully');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.truckDriverService.remove(id);
    return ResponseUtil.success(null, 'Truck driver deleted successfully');
  }

  @Get('mobile/:mobile')
  @Roles(USER_ROLES.ADMIN)
  async findByMobile(@Param('mobile') mobile: string) {
    const truckDriver = await this.truckDriverService.findByMobile(mobile);
    return ResponseUtil.success(truckDriver, 'Truck driver retrieved successfully');
  }
}