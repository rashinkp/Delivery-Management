import { AdminDocument } from '../../../schemas/admin.schema';
import { BaseRepositoryInterface } from '../../repositories/base.repository.interface';

export interface IAdminRepository extends BaseRepositoryInterface<AdminDocument> {
  // Admin-specific methods
  findByEmail(email: string): Promise<AdminDocument | null>;
  findByMobileNumber(mobileNumber: string): Promise<AdminDocument | null>;
  checkEmailExists(email: string, excludeId?: string): Promise<boolean>;
  checkMobileNumberExists(mobileNumber: string, excludeId?: string): Promise<boolean>;
  updateLastLogin(adminId: string): Promise<AdminDocument | null>;
  findByRole(role: string): Promise<AdminDocument[]>;
  getActiveAdmins(): Promise<AdminDocument[]>;
}
