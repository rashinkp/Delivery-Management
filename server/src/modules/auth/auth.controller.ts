// src/auth/auth.controller.ts
import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { IAdminService } from '../admin/interfaces/admin.service.interface';
import type { ITruckDriverService } from '../truck-driver/interfaces/truck-driver.service.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAdminService') private adminService: IAdminService,
    @Inject('ITruckDriverService') private driverService: ITruckDriverService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request & { user: any }) {
    const { sub: userId, role } = req.user;

    if (role === 'admin') {
      const admin = await this.adminService.findById(userId);
      return ApiResponseDto.success({ ...admin, role });
    }

    if (role === 'driver') {
      const driver = await this.driverService.findById(userId);
      return ApiResponseDto.success({ ...driver, role });
    }

    throw new UnauthorizedException('Invalid role');
  }

  @Post('logout')
  @Public()
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.json({ message: 'Logged out' });
  }
}
