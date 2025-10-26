import { IBaseRepository } from "src/common/repositories/base.repository.interface";
import { TruckDriver } from "src/schemas/truck-driver.schema";
import { TruckDriverQueryDto } from "../dto/truck-driver-query.dto";

export interface ITruckDriverRepository extends IBaseRepository<TruckDriver> {
  findByMobile(mobile: string): Promise<TruckDriver | null>;
  findByLicenseNumber(licenseNumber: string): Promise<TruckDriver | null>;
  findByStatus(status: string): Promise<TruckDriver[]>;
  findWithPagination(query: TruckDriverQueryDto): Promise<{
    data: TruckDriver[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
}
