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
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import type { IVendorService } from './interfaces/vendor.service.interface';

@Controller('vendors')
export class VendorController {
  constructor(
    @Inject('IVendorService')
    private readonly vendorService: IVendorService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorService.findAll();
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
