import { CreateAdminDto } from '../dto/create-admin.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { AdminResponseDto } from '../dto/admin-response.dto';

export interface IAdminService {
  create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto>;
  login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{ access_token: string; admin: AdminResponseDto }>;
  findById(id: string): Promise<AdminResponseDto>;
}
