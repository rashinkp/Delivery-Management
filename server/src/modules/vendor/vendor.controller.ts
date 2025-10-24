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
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { IVendorService } from './interfaces/vendor.service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

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
  async create(@Body() createVendorDto: CreateVendorDto): Promise<ApiResponseDto<any>> {
    try {
      const vendor = await this.vendorService.create(createVendorDto);
      return ApiResponseDto.success(vendor, 'Vendor created successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to create vendor', error.message);
    }
  }

  @Get()
  async findAll(): Promise<ApiResponseDto<any>> {
    try {
      const vendors = await this.vendorService.findAll();
      return ApiResponseDto.success(vendors, 'Vendors retrieved successfully');
    } catch (error) {
      return ApiResponseDto.error('Failed to retrieve vendors', error.message);
    }
  }

  @Get('location/:location')
  findByLocation(@Param('location') location: string) {
    return this.vendorService.findByLocation(location);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.vendorService.findByEmail(email);
  }

  @Get('contact/:contactNumber')
  findByContactNumber(@Param('contactNumber') contactNumber: string) {
    return this.vendorService.findByContactNumber(contactNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
}
