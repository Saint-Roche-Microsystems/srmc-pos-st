export interface ProductRef {
  id: string;
  name: string;
}

export interface OrderItem {
  productId: ProductRef;
  quantity: number;
  price: number;
}

export interface Order {
  userId: string;
  orderItems: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}
