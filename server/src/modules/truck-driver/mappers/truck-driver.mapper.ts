import { TruckDriver } from '../../../schemas/truck-driver.schema';
import { TruckDriverResponseDto } from '../dto/truck-driver-response.dto';

export class TruckDriverMapper {
  static toResponseDto(driver: TruckDriver): TruckDriverResponseDto {
    return new TruckDriverResponseDto(driver);
  }

  static toResponseDtoList(drivers: TruckDriver[]): TruckDriverResponseDto[] {
    return drivers.map(driver => this.toResponseDto(driver));
  }
}
