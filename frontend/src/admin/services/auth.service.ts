import type { AdminUser } from '../../shared/types';

const API_URL = '/api/admin/auth';

interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.admin));

    return data;
  },

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getStoredUser(): AdminUser | null {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  },
};