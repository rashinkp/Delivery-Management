import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { TruckDriver } from "src/schemas/truck-driver.schema";


export interface ITruckDriverRepository extends IBaseRepository<TruckDriver> {
  findByMobile(mobile: string): Promise<TruckDriver | null>;
  findByLicenseNumber(licenseNumber: string): Promise<TruckDriver | null>;
  findByStatus(status: string): Promise<TruckDriver[]>;
}
