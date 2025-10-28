export interface Product {
  productId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
}

