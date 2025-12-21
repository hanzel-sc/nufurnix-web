import type { CatalogItem, Submission, OrderStatus } from '../../shared/types';

const API_URL = '/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const adminService = {
  async getCatalog(): Promise<CatalogItem[]> {
    const response = await fetch(`${API_URL}/catalog`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch catalog');

    const data = await response.json();
    return data.items;
  },

  async createCatalogItem(item: Omit<CatalogItem, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<CatalogItem> {
    const response = await fetch(`${API_URL}/catalog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error('Failed to create item');

    const data = await response.json();
    return data.item;
  },

  async updateCatalogItem(
    id: string,
    item: Partial<CatalogItem>
  ): Promise<CatalogItem> {
    const response = await fetch(`${API_URL}/catalog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error('Failed to update item');

    const data = await response.json();
    return data.item;
  },

  async deleteCatalogItem(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/catalog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete item');
  },

  async getSubmissions(filters?: {
    type?: string;
    status?: string;
  }): Promise<Submission[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${API_URL}/submissions?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch submissions');

    const data = await response.json();
    return data.submissions;
  },

  async getSubmission(id: string): Promise<Submission> {
    const response = await fetch(`${API_URL}/submissions/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch submission');

    const data = await response.json();
    return data.submission;
  },

  async updateOrderStatus(
    submissionId: string,
    status: OrderStatus
  ): Promise<void> {
    const response = await fetch(`${API_URL}/submissions/${submissionId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Failed to update status');
  },

  async exportSubmissions(): Promise<string> {
    const response = await fetch(`${API_URL}/submissions/export`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to export submissions');

    return response.text();
  },
};