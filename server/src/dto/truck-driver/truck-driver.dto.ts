import { IsString, MinLength, MaxLength, Matches, IsOptional, IsBoolean, IsDateString, IsObject, IsNumber } from 'class-validator';

export class CreateTruckDriverDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(200)
  address: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  drivingLicense: string;

  @IsDateString()
  licenseExpiryDate: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  vehicleInfo?: {
    vehicleNumber?: string;
    vehicleType?: string;
    capacity?: number;
  };

  @IsOptional()
  preferences?: Record<string, any>;
}

export class UpdateTruckDriverDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  drivingLicense?: string;

  @IsOptional()
  @IsDateString()
  licenseExpiryDate?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  vehicleInfo?: {
    vehicleNumber?: string;
    vehicleType?: string;
    capacity?: number;
  };

  @IsOptional()
  @IsObject()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TruckDriverResponseDto {
  id: string;
  name: string;
  mobile: string;
  role: string;
  address: string;
  drivingLicense: string;
  licenseExpiryDate: Date;
  isMobileVerified: boolean;
  isLicenseValid: boolean;
  lastLoginAt?: Date;
  profileImage?: string;
  vehicleInfo?: {
    vehicleNumber?: string;
    vehicleType?: string;
    capacity?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: Date;
  };
  status: string;
  preferences?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
