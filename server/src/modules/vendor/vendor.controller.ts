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
  findByLocation(@Param('location') location: string) {
    return this.vendorService.findByLocation(location);
  }

  @Get('email/:email')
  @Roles('admin') // Only admin can search by email
  findByEmail(@Param('email') email: string) {
    return this.vendorService.findByEmail(email);
  }

  @Get('contact/:contactNumber')
  @Roles('admin') // Only admin can search by contact number
  findByContactNumber(@Param('contactNumber') contactNumber: string) {
    return this.vendorService.findByContactNumber(contactNumber);
  }

  @Get(':id')
  @Roles('admin', 'driver') // Both admin and drivers can view specific vendors
  findOne(@Param('id') id: string) {
    return this.vendorService.findById(id);
  }

  @Patch(':id')
  @Roles('admin') // Only admin can update vendors
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin') // Only admin can delete vendors
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
}
