import { TruckDriverResponseDto } from '../dto/truck-driver-response.dto';
import { CreateTruckDriverDto } from '../dto/create-truck-driver.dto';
import { UpdateTruckDriverDto } from '../dto/update-truck-driver.dto';

export interface ITruckDriverService {
  create(createTruckDriverDto: CreateTruckDriverDto): Promise<TruckDriverResponseDto>;
  findAll(): Promise<TruckDriverResponseDto[]>;
  findById(id: string): Promise<TruckDriverResponseDto>;
  update(
    id: string,
    updateTruckDriverDto: UpdateTruckDriverDto,
  ): Promise<TruckDriverResponseDto>;
  remove(id: string): Promise<void>;
  findByStatus(status: string): Promise<TruckDriverResponseDto[]>;
  findByMobile(mobile: string): Promise<TruckDriverResponseDto>;
}
