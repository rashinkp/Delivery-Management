import { Product } from '../../../schemas/product.schema';
import { ProductResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toResponseDto(product: Product): ProductResponseDto {
    return new ProductResponseDto(product);
  }

  static toResponseDtoList(products: Product[]): ProductResponseDto[] {
    return products.map(product => this.toResponseDto(product));
  }
}

