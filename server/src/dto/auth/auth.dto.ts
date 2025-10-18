import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { APP_CONSTANTS } from '../../common/constants/app-constants';

export class LoginDto {
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @IsString()
  @MinLength(APP_CONSTANTS.PASSWORD_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.PASSWORD_MAX_LENGTH)
  password: string;
}

export class RegisterDto {
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
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(APP_CONSTANTS.PASSWORD_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.PASSWORD_MAX_LENGTH)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be exactly 10 digits' })
  mobile: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(APP_CONSTANTS.PASSWORD_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.PASSWORD_MAX_LENGTH)
  newPassword: string;
}
