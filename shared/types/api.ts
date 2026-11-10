export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  completedOrderValue: number;
  lowStockProducts: number;
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  total: number;
  status: OrderStatus;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface ProductListData {
  products: Product[];
  categories: string[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface OrderListItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  total: number;
  status: OrderStatus;
}

export interface OrderListData {
  orders: OrderListItem[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  itemsTotal?: number;
  itemsPage?: number;
  itemsLimit?: number;
  itemsTotalPages?: number;
}
