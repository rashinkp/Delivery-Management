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
} from '@nestjs/common';
import { VendorService } from '../services/vendor.service';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor/vendor.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVendorDto: CreateVendorDto): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.create(createVendorDto);
    return ResponseUtil.created(vendor, 'Vendor created successfully');
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('status') status?: string,
    @Query('isEmailVerified') isEmailVerified?: boolean,
    @Query('isMobileVerified') isMobileVerified?: boolean,
    @Query('isActive') isActive?: boolean,
    @Query('tags') tags?: string,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      city,
      state,
      status,
      isEmailVerified,
      isMobileVerified,
      isActive,
      tags: tags ? tags.split(',') : undefined,
    };

    const result = await this.vendorService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Vendors retrieved successfully');
  }

  @Get('stats')
  async getStats(): Promise<ApiResponse<any>> {
    return await this.vendorService.getStats();
  }

  @Get('near-location')
  async findVendorsByLocation(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radiusKm') radiusKm: number = 10,
  ): Promise<ApiResponse<any>> {
    const vendors = await this.vendorService.findVendorsByLocation(latitude, longitude, radiusKm);
    return ResponseUtil.success(vendors, 'Nearby vendors retrieved successfully');
  }

  @Get('by-city/:city')
  async findVendorsByCity(@Param('city') city: string): Promise<ApiResponse<any>> {
    const vendors = await this.vendorService.findVendorsByCity(city);
    return ResponseUtil.success(vendors, 'Vendors by city retrieved successfully');
  }

  @Get('by-state/:state')
  async findVendorsByState(@Param('state') state: string): Promise<ApiResponse<any>> {
    const vendors = await this.vendorService.findVendorsByState(state);
    return ResponseUtil.success(vendors, 'Vendors by state retrieved successfully');
  }

  @Get('by-tags')
  async findVendorsByTags(@Query('tags') tags: string): Promise<ApiResponse<any>> {
    const tagArray = tags.split(',');
    const vendors = await this.vendorService.findVendorsByTags(tagArray);
    return ResponseUtil.success(vendors, 'Vendors by tags retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.findOne(id);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.findByEmail(email);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  @Get('mobile/:mobile')
  async findByMobile(@Param('mobile') mobile: string): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.findByMobile(mobile);
    return ResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.update(id, updateVendorDto);
    return ResponseUtil.updated(vendor, 'Vendor updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.vendorService.remove(id);
  }

  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.updateEmailVerification(id, true);
    return ResponseUtil.success(vendor, 'Vendor email verified successfully');
  }

  @Post(':id/verify-mobile')
  async verifyMobile(@Param('id') id: string): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.updateMobileVerification(id, true);
    return ResponseUtil.success(vendor, 'Vendor mobile verified successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponse<any>> {
    const vendor = await this.vendorService.updateStatus(id, body.status);
    return ResponseUtil.updated(vendor, 'Vendor status updated successfully');
  }
}
