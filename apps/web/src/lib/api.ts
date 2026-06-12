const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth
  register(body: { name: string; email: string; password: string; phone?: string }) {
    return this.request<{ token: string; user: unknown }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  login(body: { email: string; password: string }) {
    return this.request<{ token: string; user: unknown }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  getMe(token: string) {
    return this.request<{ user: unknown }>('/api/auth/me', { token });
  }

  forgotPassword(email: string) {
    return this.request<{ message: string; resetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  resetPassword(token: string, password: string) {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Products
  getProducts(params?: Record<string, string | number | boolean>) {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return this.request<{ products: unknown[]; pagination: unknown }>(`/api/products${query}`);
  }

  getFeaturedProducts() {
    return this.request<{ products: unknown[] }>('/api/products/featured');
  }

  getFlashDeals() {
    return this.request<{ products: unknown[] }>('/api/products/flash-deals');
  }

  getProduct(slug: string) {
    return this.request<{ product: unknown; related: unknown[] }>(`/api/products/${slug}`);
  }

  // Categories
  getCategories() {
    return this.request<{ categories: unknown[] }>('/api/categories');
  }

  getFeaturedCategories() {
    return this.request<{ categories: unknown[] }>('/api/categories/featured');
  }

  // Search
  search(q: string, limit = 8) {
    return this.request<{ products: unknown[]; categories: unknown[]; query: string }>(
      `/api/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );
  }

  // Orders
  createOrder(body: unknown, token?: string) {
    return this.request<{ order: unknown }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    });
  }

  validateCoupon(code: string, subtotal: number) {
    return this.request<{ valid: boolean; discount: number }>('/api/orders/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  }

  getOrders(token: string) {
    return this.request<{ orders: unknown[] }>('/api/orders', { token });
  }

  getOrder(orderNumber: string, token?: string) {
    return this.request<{ order: unknown }>(`/api/orders/${orderNumber}`, { token });
  }

  // Users
  updateProfile(body: unknown, token: string) {
    return this.request<{ user: unknown }>('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    });
  }

  getWishlist(token: string) {
    return this.request<{ wishlist: unknown[] }>('/api/users/wishlist', { token });
  }

  toggleWishlist(productId: string, token: string) {
    return this.request<{ wishlist: string[]; added: boolean }>(`/api/users/wishlist/${productId}`, {
      method: 'POST',
      token,
    });
  }

  getReviews(productId: string) {
    return this.request<{ reviews: unknown[] }>(`/api/users/reviews/${productId}`);
  }

  addReview(body: unknown, token: string) {
    return this.request<{ review: unknown }>('/api/users/reviews', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    });
  }

  addAddress(body: unknown, token: string) {
    return this.request<{ addresses: unknown[] }>('/api/users/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    });
  }

  // Admin
  getAnalytics(token: string) {
    return this.request<unknown>('/api/admin/analytics', { token });
  }

  adminGetProducts(token: string) {
    return this.request<{ products: unknown[] }>('/api/admin/products', { token });
  }

  adminCreateProduct(body: unknown, token: string) {
    return this.request<{ product: unknown }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    });
  }

  adminUpdateProduct(id: string, body: unknown, token: string) {
    return this.request<{ product: unknown }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      token,
    });
  }

  adminDeleteProduct(id: string, token: string) {
    return this.request<{ message: string }>(`/api/admin/products/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  adminGetOrders(token: string) {
    return this.request<{ orders: unknown[] }>('/api/admin/orders', { token });
  }

  adminUpdateOrder(id: string, body: unknown, token: string) {
    return this.request<{ order: unknown }>(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    });
  }

  adminGetCustomers(token: string) {
    return this.request<{ customers: unknown[] }>('/api/admin/customers', { token });
  }

  adminGetCategories(token: string) {
    return this.request<{ categories: unknown[] }>('/api/admin/categories', { token });
  }

  adminCreateCategory(body: unknown, token: string) {
    return this.request<{ category: unknown }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    });
  }
}

export const api = new ApiClient(API_URL);
