export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  applications: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  catalogItem: CatalogItem;
  quantity: number;
}

export type SubmissionType = 'ENQUIRY' | 'ORDER';

export interface SubmissionItemInput {
  catalogItemId: string;
  quantity: number;
}

export interface CreateSubmissionInput {
  type: SubmissionType;
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  items: SubmissionItemInput[];
  deliveryAddress?: string;
}

export interface Submission {
  id: string;
  type: SubmissionType;
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
  items: SubmissionItem[];
  order?: Order;
}

export interface SubmissionItem {
  catalogItemId: string;
  quantity: number;
  catalogItem: CatalogItem;
}

export interface Order {
  submissionId: string;
  deliveryAddress: string;
  orderStatus: OrderStatus;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}