import { Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from '../dto/admin/admin.dto';
import { PaginationDto } from '../dto/common/pagination.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { NotFoundException, ConflictException, ValidationException } from '../common/exceptions/custom.exceptions';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepository: AdminRepository) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    this.logger.log('Creating new admin', { email: createAdminDto.email });

    // Check if email already exists
    const existingEmail = await this.adminRepository.checkEmailExists(createAdminDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if mobile already exists
    const existingMobile = await this.adminRepository.checkMobileExists(createAdminDto.mobile);
    if (existingMobile) {
      throw new ConflictException('Mobile number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 12);

    // Create admin
    const admin = await this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
      email: createAdminDto.email.toLowerCase(),
    });

    this.logger.log('Admin created successfully', { id: admin._id });

    return this.mapToResponseDto(admin);
  }

  async findAll(pagination: PaginationDto, filters?: any): Promise<any> {
    this.logger.log('Fetching admins with pagination', { pagination, filters });

    const result = await this.adminRepository.findAdminsWithPagination(pagination, filters);
    
    return {
      ...result,
      data: result.data.map(admin => this.mapToResponseDto(admin))
    };
  }

  async findOne(id: string): Promise<AdminResponseDto> {
    this.logger.log('Fetching admin by id', { id });

    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.mapToResponseDto(admin);
  }

  async findByEmail(email: string): Promise<AdminResponseDto> {
    this.logger.log('Fetching admin by email', { email });

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.mapToResponseDto(admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    this.logger.log('Updating admin', { id });

    const existingAdmin = await this.adminRepository.findById(id);
    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Check email uniqueness if email is being updated
    if (updateAdminDto.email && updateAdminDto.email !== existingAdmin.email) {
      const emailExists = await this.adminRepository.checkEmailExists(updateAdminDto.email, id);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
      updateAdminDto.email = updateAdminDto.email.toLowerCase();
    }

    // Check mobile uniqueness if mobile is being updated
    if (updateAdminDto.mobile && updateAdminDto.mobile !== existingAdmin.mobile) {
      const mobileExists = await this.adminRepository.checkMobileExists(updateAdminDto.mobile, id);
      if (mobileExists) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    const updatedAdmin = await this.adminRepository.updateById(id, {
      ...updateAdminDto,
      updatedAt: new Date(),
    });

    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    this.logger.log('Admin updated successfully', { id });

    return this.mapToResponseDto(updatedAdmin);
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Deleting admin', { id });

    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Soft delete
    await this.adminRepository.updateById(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    this.logger.log('Admin deleted successfully', { id });
  }

  async getStats(): Promise<any> {
    this.logger.log('Fetching admin statistics');

    const stats = await this.adminRepository.getAdminStats();
    return ResponseUtil.success(stats, 'Admin statistics retrieved successfully');
  }

  async verifyEmail(id: string): Promise<AdminResponseDto> {
    this.logger.log('Verifying admin email', { id });

    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updatedAdmin = await this.adminRepository.updateEmailVerificationStatus(id, true);
    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    this.logger.log('Admin email verified successfully', { id });

    return this.mapToResponseDto(updatedAdmin);
  }

  async verifyMobile(id: string): Promise<AdminResponseDto> {
    this.logger.log('Verifying admin mobile', { id });

    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updatedAdmin = await this.adminRepository.updateMobileVerificationStatus(id, true);
    if (!updatedAdmin) {
      throw new NotFoundException('Admin not found');
    }

    this.logger.log('Admin mobile verified successfully', { id });

    return this.mapToResponseDto(updatedAdmin);
  }

  async updateLastLogin(id: string): Promise<void> {
    this.logger.log('Updating admin last login', { id });

    await this.adminRepository.updateLastLogin(id);
  }

  async validateCredentials(email: string, password: string): Promise<AdminResponseDto> {
    this.logger.log('Validating admin credentials', { email });

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    // Update last login
    await this.adminRepository.updateLastLogin((admin._id as any).toString());

    this.logger.log('Admin credentials validated successfully', { id: admin._id });

    return this.mapToResponseDto(admin);
  }

  private mapToResponseDto(admin: any): AdminResponseDto {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      mobile: admin.mobile,
      role: admin.role,
      isEmailVerified: admin.isEmailVerified,
      isMobileVerified: admin.isMobileVerified,
      lastLoginAt: admin.lastLoginAt,
      profileImage: admin.profileImage,
      preferences: admin.preferences,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
