const API_BASE = (import.meta.env.VITE_API_URL || "/api").trim().replace(/\/$/, "");

// Upload API returns backend-relative paths (/uploads/...). Resolve them against
// the backend origin (not the frontend host and not the /api path).
const API_ORIGIN = API_BASE.replace(/\/api$/, "");
export function resolveMediaUrl(value) {
  if (!value || typeof value !== 'string') return '';
  const url = value.trim();
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  return `${API_ORIGIN}/${url.replace(/^\/+/, '')}`;
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('mrkzone_token');

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const raw = await response.text();
    let data = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        const isHtml = /<\s*!doctype|<\s*html/i.test(raw);
        throw new Error(
            isHtml
                ? `API returned an HTML page instead of JSON (${response.status}). Check VITE_API_URL and backend deployment.`
                : `API returned an invalid response (${response.status}).`
        );
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  sendOtp: (email) => apiRequest('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (data) => apiRequest('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => apiRequest('/auth/me'),
  changePassword: (data) => apiRequest('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
};

// Products API
export const productApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    return apiRequest(`/products?${query.toString()}`);
  },
  getProductById: (id) => apiRequest(`/products/${id}`),
  getProductBySlug: (slug) => apiRequest(`/products/slug/${slug}`),
  getFeatured: () => apiRequest('/products/featured'),
  getBestSellers: () => apiRequest('/products/best-sellers'),
  getTrending: () => apiRequest('/products/trending'),
  getSuggestions: (q) => apiRequest(`/products/suggestions?q=${encodeURIComponent(q)}`),
  getSimilar: (id, categoryId) => apiRequest(`/products/${id}/similar?categoryId=${categoryId}`),
  getFrequentlyBoughtTogether: () => apiRequest('/products/frequently-bought-together'),
};

// Categories & Brands
export const metaApi = {
  getCategories: () => apiRequest('/categories'),
  getBrands: () => apiRequest('/brands'),
  getBanners: () => apiRequest('/banners'),
  checkDelivery: (pincode, subtotal = 0) => apiRequest(`/delivery/check?pincode=${encodeURIComponent(pincode)}&subtotal=${encodeURIComponent(subtotal)}`),
  validateCoupon: (code, amount) => apiRequest('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
};

// Cart API
export const cartApi = {
  getCart: () => apiRequest('/cart'),
  addToCart: (productId, quantity = 1) => apiRequest('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateQuantity: (cartItemId, quantity) => apiRequest('/cart/update', { method: 'PUT', body: JSON.stringify({ cartItemId, quantity }) }),
  removeItem: (itemId) => apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiRequest('/cart/clear', { method: 'DELETE' }),
};

// Wishlist API
export const wishlistApi = {
  getWishlist: () => apiRequest('/wishlist'),
  toggleItem: (productId) => apiRequest(`/wishlist/toggle/${productId}`, { method: 'POST' }),
  removeItem: (productId) => apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),
};

// Orders & Checkout API
export const orderApi = {
  checkout: (orderData) => apiRequest('/orders/checkout', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  trackOrder: (orderNumber) => apiRequest(`/orders/track/${orderNumber}`),
  cancelOrder: (orderNumber, reason) => apiRequest(`/orders/${orderNumber}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  requestReturn: (orderNumber, reason, comments) => apiRequest(`/orders/${orderNumber}/return`, { method: 'POST', body: JSON.stringify({ reason, comments }) }),
};

// Payment API
export const paymentApi = {
  getUpiDetails: (orderNumber) => apiRequest(`/payments/upi/${orderNumber}`),
  verifyUpi: (data) => apiRequest('/payments/verify/upi', { method: 'POST', body: JSON.stringify(data) }),
  verifyRazorpay: (data) => apiRequest('/payments/verify/razorpay', { method: 'POST', body: JSON.stringify(data) }),
};

// Reviews API
export const reviewApi = {
  getProductReviews: (productId) => apiRequest(`/reviews/product/${productId}`),
  submitReview: (data) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  markHelpful: (id) => apiRequest(`/reviews/${id}/helpful`, { method: 'POST' }),
};

// User Profile & Addresses
export const userApi = {
  getAddresses: () => apiRequest('/user/addresses'),
  addAddress: (address) => apiRequest('/user/addresses', { method: 'POST', body: JSON.stringify(address) }),
  deleteAddress: (id) => apiRequest(`/user/addresses/${id}`, { method: 'DELETE' }),
  getNotifications: () => apiRequest('/user/notifications'),
  markNotificationRead: (id) => apiRequest(`/user/notifications/${id}/read`, { method: 'PUT' }),
};

// Admin API
export const adminApi = {
  getStats: () => apiRequest('/admin/stats'),
  getOrders: () => apiRequest('/admin/orders'),
  updateOrderStatus: (orderNumber, data) => apiRequest(`/admin/orders/${orderNumber}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  processRefund: (orderId, reason) => apiRequest(`/admin/orders/${orderId}/refund`, { method: 'POST', body: JSON.stringify({ reason }) }),
  createProduct: (data) => apiRequest('/admin/products', { method: 'POST', body: JSON.stringify(data) }),

  uploadProductImages: async (files) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));

    const token = localStorage.getItem('mrkzone_token');

    const response = await fetch(`${API_BASE}/admin/uploads`, {
      method: 'POST',
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const raw = await response.text();
    let data = null;

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Image upload returned an invalid response (${response.status}).`);
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Image upload failed');
    }

    return data;
  },

  updateProduct: (id, data) => apiRequest(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => apiRequest(`/admin/products/${id}`, { method: 'DELETE' }),
  getCustomers: () => apiRequest('/admin/customers'),
  toggleCustomerStatus: (id) => apiRequest(`/admin/customers/${id}/toggle-status`, { method: 'PUT' }),
  getCoupons: () => apiRequest('/admin/coupons'),
  createCoupon: (coupon) => apiRequest('/admin/coupons', { method: 'POST', body: JSON.stringify(coupon) }),
  deleteCoupon: (id) => apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' }),
  getBanners: () => apiRequest('/admin/banners'),
  createBanner: (banner) => apiRequest('/admin/banners', { method: 'POST', body: JSON.stringify(banner) }),
  updateBanner: (id, banner) => apiRequest(`/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(banner) }),
  deleteBanner: (id) => apiRequest(`/admin/banners/${id}`, { method: 'DELETE' }),
  getReviews: () => apiRequest('/admin/reviews'),
  deleteReview: (id) => apiRequest(`/admin/reviews/${id}`, { method: 'DELETE' }),
  createCategory: (cat) => apiRequest('/admin/categories', { method: 'POST', body: JSON.stringify(cat) }),
  updateCategory: (id, cat) => apiRequest(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
  deleteCategory: (id) => apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
  createBrand: (brand) => apiRequest('/admin/brands', { method: 'POST', body: JSON.stringify(brand) }),
  updateBrand: (id, brand) => apiRequest(`/admin/brands/${id}`, { method: 'PUT', body: JSON.stringify(brand) }),
  deleteBrand: (id) => apiRequest(`/admin/brands/${id}`, { method: 'DELETE' }),
};
