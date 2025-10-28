import { IBaseRepository } from 'src/common/repositories/base.repository.interface';
import { Admin } from 'src/schemas/admin.schema';

export interface IAdminRepository extends IBaseRepository<Admin> {
  findByEmail(email: string): Promise<Admin | null>;
}
