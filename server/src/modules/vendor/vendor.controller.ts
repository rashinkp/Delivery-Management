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
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { IVendorService } from './interfaces/vendor.service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VendorController {
  constructor(
    @Inject('IVendorService')
    private readonly vendorService: IVendorService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin') // Only admin can create vendors
  async create(
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.create(createVendorDto);
      return ApiResponseDto.success(vendor, 'Vendor created successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to create vendor', error.message);
    }
  }

  @Get()
  @Roles('admin', 'driver')
  async findAll(
    @Query() query: import('./dto/vendor-query.dto').VendorQueryDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const result = await this.vendorService.findWithPagination(query);
      return ApiResponseDto.success(result, 'Vendors retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendors', error.message);
    }
  }

  @Get('location/:location')
  @Roles('admin', 'driver') // Both admin and drivers can search by location
  async findByLocation(@Param('location') location: string): Promise<ApiResponseDto<any>> {
    try {
      const vendors = await this.vendorService.findByLocation(location);
      return ApiResponseDto.success(vendors, 'Vendors retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendors', error.message);
    }
  }

  @Get('email/:email')
  @Roles('admin') // Only admin can search by email
  async findByEmail(@Param('email') email: string): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.findByEmail(email);
      return ApiResponseDto.success(vendor, 'Vendor retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendor', error.message);
    }
  }

  @Get('contact/:contactNumber')
  @Roles('admin') // Only admin can search by contact number
  async findByContactNumber(@Param('contactNumber') contactNumber: string): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.findByContactNumber(contactNumber);
      return ApiResponseDto.success(vendor, 'Vendor retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendor', error.message);
    }
  }

  @Get(':id')
  @Roles('admin', 'driver') // Both admin and drivers can view specific vendors
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.findById(id);
      return ApiResponseDto.success(vendor, 'Vendor retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendor', error.message);
    }
  }

  @Patch(':id')
  @Roles('admin') // Only admin can update vendors
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.update(id, updateVendorDto);
      return ApiResponseDto.success(vendor, 'Vendor updated successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to update vendor', error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin') // Only admin can delete vendors
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
}
