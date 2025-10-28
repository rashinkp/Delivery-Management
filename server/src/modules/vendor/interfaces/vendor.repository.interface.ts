import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { Vendor } from "src/schemas/vendor.schema";


export interface IVendorRepository extends IBaseRepository<Vendor> {
  findAll(): Promise<Vendor[]>;
  findByEmail(email: string): Promise<Vendor | null>;
  findByContactNumber(contactNumber: string): Promise<Vendor | null>;
  findByLocation(location: string): Promise<Vendor[]>;
  findWithPagination(query: import('../dto/vendor-query.dto').VendorQueryDto): Promise<{
    data: Vendor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
}
