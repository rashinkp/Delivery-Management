import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { IAdminRepository } from './interfaces/admin.repository.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { AdminMapper } from './mappers/admin.mapper';
import { IAdminService } from './interfaces/admin.service.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepo: IAdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const existing = await this.adminRepo.findByEmail(createAdminDto.email);
    if (existing) throw new UnauthorizedException('Admin already exists');

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    createAdminDto.password = hashedPassword;

    const admin = await this.adminRepo.create(createAdminDto);
    return AdminMapper.toResponseDto(admin);
  }

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{ access_token: string; admin: AdminResponseDto }> {
    const admin = await this.adminRepo.findByEmail(loginAdminDto.email);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: admin._id, email: admin.email, role: admin.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      admin: AdminMapper.toResponseDto(admin),
    };
  }

  async findById(id: string): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return AdminMapper.toResponseDto(admin);
  }
}
