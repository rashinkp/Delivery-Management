import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Inject,
  Res,
  UseGuards,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import type { IAdminService } from './interfaces/admin.service.interface';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { LoggerService } from 'src/common/logger/logger.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AdminController {
  constructor(
    @Inject('IAdminService')
    private readonly adminService: IAdminService,
    private readonly logger: LoggerService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateAdminDto): Promise<ApiResponseDto<any>> {
    try {
      const admin = await this.adminService.create(dto);
      return ApiResponseDto.success(admin, 'Admin created');
    } catch (error) {
      return ApiResponseDto.error('Registration failed', error.message);
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<any>> {
    try {
      this.logger.log(`🔑 Admin login attempt: ${dto.email}`, 'Auth');
      const { access_token } = await this.adminService.login(dto);
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      this.logger.log(`✅ Admin login successful: ${dto.email}`, 'Auth');
      return ApiResponseDto.success(null, 'Login successful');
    } catch (error) {
      this.logger.warn(`❌ Admin login failed: ${dto.email} - ${error.message}`, 'Auth');
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Get('me')
  @Roles('admin')
  async getMe(@Req() req: Request & { user: { sub: string } }) {
    try {
      const admin = await this.adminService.findById(req.user.sub);
      return ApiResponseDto.success(admin, 'Admin profile retrieved');
    } catch (error) {
      return ApiResponseDto.error('Failed to get profile', error.message);
    }
  }
}

