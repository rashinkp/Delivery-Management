import { PartialType } from '@nestjs/mapped-types';
import { CreateTruckDriverDto } from './create-truck-driver.dto';

export class UpdateTruckDriverDto extends PartialType(CreateTruckDriverDto) {
  licenseNumber?: string;
}
