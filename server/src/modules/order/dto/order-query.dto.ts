import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value);
    return isNaN(num) ? 1 : num;
  })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => {
    const num = parseInt(value);
    return isNaN(num) ? 10 : num;
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsEnum(['pending', 'delivered'])
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
