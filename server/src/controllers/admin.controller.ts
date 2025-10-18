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
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto, UpdateAdminDto } from '../dto/admin/admin.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOnly } from '../auth/decorators/roles.decorator';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import type { ApiResponse } from '../common/interfaces/api-response.interface';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOnly()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto): Promise<ApiResponse<any>> {
    const admin = await this.adminService.create(createAdminDto);
    return ResponseUtil.created(admin, 'Admin created successfully');
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isEmailVerified') isEmailVerified?: boolean,
    @Query('isMobileVerified') isMobileVerified?: boolean,
    @Query('isActive') isActive?: boolean,
  ): Promise<ApiResponse<any>> {
    const filters = {
      search,
      role,
      isEmailVerified,
      isMobileVerified,
      isActive,
    };

    const result = await this.adminService.findAll(pagination, filters);
    return ResponseUtil.success(result, 'Admins retrieved successfully');
  }

  @Get('stats')
  async getStats(): Promise<ApiResponse<any>> {
    return await this.adminService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<any>> {
    const admin = await this.adminService.findOne(id);
    return ResponseUtil.success(admin, 'Admin retrieved successfully');
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<ApiResponse<any>> {
    const admin = await this.adminService.findByEmail(email);
    return ResponseUtil.success(admin, 'Admin retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<ApiResponse<any>> {
    const admin = await this.adminService.update(id, updateAdminDto);
    return ResponseUtil.updated(admin, 'Admin updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminService.remove(id);
  }

  @Post(':id/verify-email')
  async verifyEmail(@Param('id') id: string): Promise<ApiResponse<any>> {
    const admin = await this.adminService.verifyEmail(id);
    return ResponseUtil.success(admin, 'Admin email verified successfully');
  }

  @Post(':id/verify-mobile')
  async verifyMobile(@Param('id') id: string): Promise<ApiResponse<any>> {
    const admin = await this.adminService.verifyMobile(id);
    return ResponseUtil.success(admin, 'Admin mobile verified successfully');
  }
}
