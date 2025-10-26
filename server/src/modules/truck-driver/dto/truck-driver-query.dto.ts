import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class TruckDriverQueryDto {
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
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
