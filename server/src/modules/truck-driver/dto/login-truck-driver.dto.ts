import { IsMobilePhone, IsNotEmpty } from 'class-validator';

export class LoginTruckDriverDto {
  @IsMobilePhone('en-IN')
  mobile: string;

  @IsNotEmpty()
  password: string;
}
