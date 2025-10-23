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
import { CreateTruckDriverDto } from './dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from './dto/update-truck-driver.dto';
import type { ITruckDriverService } from './interfaces/truck-driver.service.interface';

@Controller('truck-drivers')
export class TruckDriverController {
  constructor(
    @Inject('ITruckDriverService')
    private readonly truckDriverService: ITruckDriverService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTruckDriverDto: CreateTruckDriverDto) {
    return this.truckDriverService.create(createTruckDriverDto);
  }

  @Get()
  findAll() {
    return this.truckDriverService.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.truckDriverService.findByStatus(status);
  }

  @Get('mobile/:mobile')
  findByMobile(@Param('mobile') mobile: string) {
    return this.truckDriverService.findByMobile(mobile);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.truckDriverService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTruckDriverDto: UpdateTruckDriverDto,
  ) {
    return this.truckDriverService.update(id, updateTruckDriverDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.truckDriverService.remove(id);
  }
}
