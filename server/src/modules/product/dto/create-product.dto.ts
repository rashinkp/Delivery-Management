import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsPositive()
  stock: number;
}
