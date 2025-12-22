import type { CatalogItem, CreateSubmissionInput } from '../../shared/types';

const API_URL = '/api';

export const catalogService = {
  async getCatalog(category?: string): Promise<CatalogItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);

    const response = await fetch(`${API_URL}/catalog?${params}`);
    if (!response.ok) throw new Error('Failed to fetch catalog');

    const data = await response.json();
    return data.items;
  },

  async getItem(id: string): Promise<CatalogItem> {
    const response = await fetch(`${API_URL}/catalog/${id}`);
    if (!response.ok) throw new Error('Failed to fetch item');

    const data = await response.json();
    return data.item;
  },

  async submitEnquiryOrOrder(
    input: CreateSubmissionInput
  ): Promise<{ submissionId: string; type: string; message: string }> {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit');
    }

    return response.json();
  },
};