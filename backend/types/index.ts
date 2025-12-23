import { FastifyRequest } from 'fastify';

export interface AdminJWTPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  admin: AdminJWTPayload;
}

export interface SubmissionItemInput {
  catalogItemId: string;
  quantity: number;
}

export interface CreateSubmissionInput {
  type: 'ENQUIRY' | 'ORDER';
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  items: SubmissionItemInput[];
  deliveryAddress?: string;
}

export interface CreateCatalogItemInput {
  name: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  applications: string[];
  images: string[];
}

export interface UpdateCatalogItemInput extends Partial<CreateCatalogItemInput> {
  isActive?: boolean;
}

export interface NotificationJobData {
  submissionId: string;
  type: 'ENQUIRY' | 'ORDER';
  customerEmail: string;
  customerName: string;
}