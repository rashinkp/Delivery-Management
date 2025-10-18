import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from '../../../dto/admin/admin.dto';
import { PaginationDto } from '../../../dto/common/pagination.dto';

export interface IAdminService {
  // CRUD operations
  createAdmin(createAdminDto: CreateAdminDto): Promise<AdminResponseDto>;
  findAllAdmins(paginationDto: PaginationDto): Promise<{ data: AdminResponseDto[]; total: number; page: number; limit: number }>;
  findAdminById(id: string): Promise<AdminResponseDto>;
  updateAdmin(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto>;
  deleteAdmin(id: string): Promise<void>;

  // Authentication
  validateCredentials(email: string, password: string): Promise<AdminResponseDto>;
  updateLastLogin(adminId: string): Promise<void>;

  // Utility methods
  checkEmailExists(email: string, excludeId?: string): Promise<boolean>;
  checkMobileNumberExists(mobileNumber: string, excludeId?: string): Promise<boolean>;
  findByEmail(email: string): Promise<AdminResponseDto | null>;
  findByMobileNumber(mobileNumber: string): Promise<AdminResponseDto | null>;
}
