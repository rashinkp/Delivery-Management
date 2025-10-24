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
  Res,
} from '@nestjs/common';
import { CreateTruckDriverDto } from './dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from './dto/update-truck-driver.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import type { ITruckDriverService } from './interfaces/truck-driver.service.interface';
import { LoginTruckDriverDto } from './dto/login-truck-driver.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('truck-drivers')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TruckDriverController {
  constructor(
    @Inject('ITruckDriverService')
    private readonly truckDriverService: ITruckDriverService,
  ) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTruckDriverDto: CreateTruckDriverDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.create(createTruckDriverDto);
      return ApiResponseDto.success(
        driver,
        'Truck driver created successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to create truck driver',
        error.message,
      );
    }
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<ApiResponseDto<any>> {
    try {
      const drivers = await this.truckDriverService.findAll();
      return ApiResponseDto.success(
        drivers,
        'Truck drivers retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve truck drivers',
        error.message,
      );
    }
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const drivers = await this.truckDriverService.findByStatus(status);
      return ApiResponseDto.success(
        drivers,
        'Truck drivers retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve truck drivers',
        error.message,
      );
    }
  }

  @Get('mobile/:mobile')
  async findByMobile(
    @Param('mobile') mobile: string,
  ): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.findByMobile(mobile);
      return ApiResponseDto.success(
        driver,
        'Truck driver retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve truck driver',
        error.message,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.findById(id);
      return ApiResponseDto.success(
        driver,
        'Truck driver retrieved successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to retrieve truck driver',
        error.message,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<ApiResponseDto<any>> {
    try {
      const driver = await this.truckDriverService.update(
        id,
        updateTruckDriverDto,
      );
      return ApiResponseDto.success(
        driver,
        'Truck driver updated successfully',
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to update truck driver',
        error.message,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    try {
      await this.truckDriverService.remove(id);
      return ApiResponseDto.success(null, 'Truck driver deleted successfully');
    } catch (error) {
      return ApiResponseDto.error(
        'Failed to delete truck driver',
        error.message,
      );
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginTruckDriverDto,
    @Res({ passthrough: true }) res: Response, 
  ): Promise<ApiResponseDto<any>> {
    try {
      const { token } = await this.truckDriverService.login(loginDto);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, 
      });

      return ApiResponseDto.success(
        null,
        'Truck driver logged in successfully',
      );
    } catch (error) {
      return ApiResponseDto.error('Login failed', error.message);
    }
  }
}
