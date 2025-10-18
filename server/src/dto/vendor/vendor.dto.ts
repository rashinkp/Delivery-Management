import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsBoolean, IsObject, IsNumber } from 'class-validator';

export class CreateVendorDto {
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
  @MinLength(10)
  @MaxLength(200)
  address: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[0-9]{6}$/, { message: 'Pincode must be exactly 6 digits' })
  pincode: string;

  @IsObject()
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  businessInfo?: {
    gstNumber?: string;
    panNumber?: string;
    businessType?: string;
    registrationDate?: string;
  };

  @IsOptional()
  @IsObject()
  contactInfo?: {
    alternateMobile?: string;
    alternateEmail?: string;
    emergencyContact?: string;
  };

  @IsOptional()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateVendorDto {
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
  @MinLength(10)
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[0-9]{6}$/, { message: 'Pincode must be exactly 6 digits' })
  pincode?: string;

  @IsOptional()
  @IsObject()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  businessInfo?: {
    gstNumber?: string;
    panNumber?: string;
    businessType?: string;
    registrationDate?: string;
  };

  @IsOptional()
  @IsObject()
  contactInfo?: {
    alternateMobile?: string;
    alternateEmail?: string;
    emergencyContact?: string;
  };

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class VendorResponseDto {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  profileImage?: string;
  businessInfo?: {
    gstNumber?: string;
    panNumber?: string;
    businessType?: string;
    registrationDate?: Date;
  };
  contactInfo?: {
    alternateMobile?: string;
    alternateEmail?: string;
    emergencyContact?: string;
  };
  status: string;
  preferences?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
