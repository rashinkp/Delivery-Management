export class ProductResponseDto {
  productId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(product: any) {
    this.productId = product._id?.toString() || product.id?.toString();
    this.name = product.name;
    this.price = product.price;
    this.category = product.category;
    this.image = product.image;
    this.stock = product.stock;
    this.isDeleted = !!product.isDeleted;
    this.deletedAt = product.deletedAt ?? null;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
