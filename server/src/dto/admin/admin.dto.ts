import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsBoolean } from 'class-validator';
import { APP_CONSTANTS } from '../../common/constants/app-constants';

export class CreateAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @IsString()
  @MinLength(APP_CONSTANTS.PASSWORD_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.PASSWORD_MAX_LENGTH)
  password: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  preferences?: Record<string, any>;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AdminResponseDto {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  lastLoginAt?: Date;
  profileImage?: string;
  preferences?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
