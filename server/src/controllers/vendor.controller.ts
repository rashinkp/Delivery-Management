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
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor/vendor.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVendorDto: CreateVendorDto) {
    const vendor = await this.vendorService.create(createVendorDto);
    return ResponseUtil.success(vendor, 'Vendor created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.vendorService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Vendors retrieved successfully');
  }

  @Get('near-location')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findNearLocation(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 10,
  ) {
    const vendors = await this.vendorService.findVendorsByLocation(
      latitude,
      longitude,
      radius,
    );
    return ResponseUtil.success(vendors, 'Nearby vendors retrieved successfully');
  }

  @Get('by-city/:city')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByCity(@Param('city') city: string) {
    const vendors = await this.vendorService.findVendorsByCity(city);
    return ResponseUtil.success(vendors, 'Vendors by city retrieved successfully');
  }

  @Get('by-state/:state')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByState(@Param('state') state: string) {
    const vendors = await this.vendorService.findVendorsByState(state);
    return ResponseUtil.success(vendors, 'Vendors by state retrieved successfully');
  }

  @Get('search')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async search(@Query('q') query: string) {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'searchVendors');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.vendorService.getStats();
    return ResponseUtil.success(stats, 'Vendor statistics retrieved successfully');
  }

  @Get('by-tags')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findByTags(@Query('tags') tags: string) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    const vendors = await this.vendorService.findVendorsByTags(tagArray);
    return ResponseUtil.success(vendors, 'Vendors by tags retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.TRUCK_DRIVER)
  async findOne(@Param('id') id: string) {
    const vendor = await this.vendorService.findOne(id);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  async update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorService.update(id, updateVendorDto);
    return ResponseUtil.success(vendor, 'Vendor updated successfully');
  }

  @Patch(':id/status')
  @Roles(USER_ROLES.ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const vendor = await this.vendorService.updateStatus(id, status);
    return ResponseUtil.success(vendor, 'Vendor status updated successfully');
  }

  @Patch(':id/location')
  @Roles(USER_ROLES.ADMIN)
  async updateLocation(
    @Param('id') id: string,
    @Body() location: { latitude: number; longitude: number; address: string },
  ) {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'updateLocation');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.vendorService.remove(id);
    return ResponseUtil.success(null, 'Vendor deleted successfully');
  }

  @Get('email/:email')
  @Roles(USER_ROLES.ADMIN)
  async findByEmail(@Param('email') email: string) {
    const vendor = await this.vendorService.findByEmail(email);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  @Get('mobile/:mobile')
  @Roles(USER_ROLES.ADMIN)
  async findByMobile(@Param('mobile') mobile: string) {
    const vendor = await this.vendorService.findByMobile(mobile);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }
}