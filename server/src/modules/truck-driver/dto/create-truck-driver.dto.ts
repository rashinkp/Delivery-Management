import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateTruckDriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}
