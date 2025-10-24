import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
