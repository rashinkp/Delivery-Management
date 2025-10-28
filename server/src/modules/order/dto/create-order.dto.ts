// src/orders/dto/create-order.dto.ts
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  driverId: string;

  @IsMongoId()
  @IsNotEmpty()
  vendorId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderProductItemDto)
  products: OrderProductItemDto[];

  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsNumber()
  @Min(0)
  collectedAmount: number;
}
