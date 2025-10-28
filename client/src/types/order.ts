export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDriver {
  driverId: string;
  name: string;
  mobile: string;
}

export interface OrderVendor {
  vendorId: string;
  name: string;
  location: string;
  contactNumber: string;
}

export interface Order {
  orderId: string;
  orderNumber?: string;
  driver: OrderDriver;
  vendor: OrderVendor;
  products: OrderProduct[];
  totalAmount: number;
  collectedAmount?: number;
  status?: 'pending' | 'delivered';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  driverId: string;
  vendorId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  collectedAmount: number;
}

export interface UpdateOrderDto {
  products?: Array<{
    productId: string;
    quantity: number;
  }>;
  status?: 'pending' | 'delivered';
  collectedAmount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

