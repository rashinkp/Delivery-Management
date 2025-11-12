import { IsNumber, IsPositive } from 'class-validator';

export class IncreaseStockDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
}

