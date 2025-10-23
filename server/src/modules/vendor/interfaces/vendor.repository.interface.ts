import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { Vendor } from "src/schemas/vendor.schema";


export interface IVendorRepository extends IBaseRepository<Vendor> {
  findAll(): Promise<Vendor[]>;
  findByEmail(email: string): Promise<Vendor | null>;
  findByContactNumber(contactNumber: string): Promise<Vendor | null>;
  findByLocation(location: string): Promise<Vendor[]>;
}
