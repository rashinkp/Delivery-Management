import { TruckDriver } from 'src/schemas/truck-driver.schema';
import { CreateTruckDriverDto } from '../dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from '../dto/update-truck-driver.dto';

export interface ITruckDriverService {
  create(createTruckDriverDto: CreateTruckDriverDto): Promise<TruckDriver>;
  findAll(): Promise<TruckDriver[]>;
  findById(id: string): Promise<TruckDriver>;
  update(
    id: string,
    updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<TruckDriver>;
  remove(id: string): Promise<void>;
  findByStatus(status: string): Promise<TruckDriver[]>;
  findByMobile(mobile: string): Promise<TruckDriver>;
}
