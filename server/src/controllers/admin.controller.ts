import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { CreateAdminDto, UpdateAdminDto } from '../dto/admin/admin.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../common/constants/app-constants';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.create(createAdminDto);
    return ResponseUtil.success(admin, 'Admin created successfully');
  }

  @Get()
  @Roles(USER_ROLES.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.adminService.findAll(paginationDto);
    return ResponseUtil.success(result, 'Admins retrieved successfully');
  }

  @Get('stats')
  @Roles(USER_ROLES.ADMIN)
  async getStats() {
    const stats = await this.adminService.getStats();
    return ResponseUtil.success(stats, 'Admin statistics retrieved successfully');
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN)
  async findOne(@Param('id') id: string) {
    const admin = await this.adminService.findOne(id);
    return ResponseUtil.success(admin, 'Admin retrieved successfully');
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminService.update(id, updateAdminDto);
    return ResponseUtil.success(admin, 'Admin updated successfully');
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.adminService.remove(id);
    return ResponseUtil.success(null, 'Admin deleted successfully');
  }

  @Get('email/:email')
  @Roles(USER_ROLES.ADMIN)
  async findByEmail(@Param('email') email: string) {
    const admin = await this.adminService.findByEmail(email);
    return ResponseUtil.success(admin, 'Admin retrieved successfully');
  }

  @Get('mobile/:mobile')
  @Roles(USER_ROLES.ADMIN)
  async findByMobile(@Param('mobile') mobile: string) {
    // This would need to be implemented in the service
    return ResponseUtil.error('Method not implemented', 'findByMobile');
  }
}