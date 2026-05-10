const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Token injector — reads from Zustand persisted storage without importing the store
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type to application/json if not sending FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    // Avoid JSON.stringify if it's already FormData
    body: isFormData ? options.body : options.body, 
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    console.log({ error });
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      fetchApi("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    verifyEmail: (token: string) =>
      fetchApi(`/auth/verify-email?token=${token}`),
    resendVerificationEmail: () =>
      fetchApi("/auth/resend-verification-email", { method: "POST" }),
    getMe: () => fetchApi("/users/me"),
  },
  users: {
    create: (body: Record<string, unknown>) =>
      fetchApi("/users/create-user", { method: "POST", body: JSON.stringify(body) }),
    updateProfile: (body: Record<string, unknown>) =>
      fetchApi("/users/update-my-profile", { method: "PATCH", body: JSON.stringify(body) }),
  },
  products: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/products?${query.toString()}`);
    },
    getSingle: (id: string) => fetchApi(`/products/${id}`),
    create: (data: unknown) => fetchApi("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    getFeatured: () => fetchApi("/products?isFeatured=true&limit=8"),
    getBestSellers: () => fetchApi("/products?isBestSeller=true&limit=4"),
    getNewArrivals: () => fetchApi("/products?isNewProduct=true&limit=4"),
  },
  categories: {
    getAll: () => fetchApi("/categories"),
  },
  orders: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/orders?${query.toString()}`);
    },
    getSingle: (id: string) => fetchApi(`/orders/${id}`),
    create: (orderData: unknown) =>
      fetchApi("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),
  },
  dashboard: {
    getStats: () => fetchApi("/dashboard/stats"),
  },
  partners: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/partners?${query.toString()}`);
    },
    create: (data: unknown) => fetchApi("/partners", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/partners/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/partners/${id}`, { method: "DELETE" }),
  },
  services: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/services?${query.toString()}`);
    },
    create: (data: unknown) => fetchApi("/services", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/services/${id}`, { method: "DELETE" }),
  },
  blogs: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/blogs?${query.toString()}`);
    },
    create: (data: unknown) => fetchApi("/blogs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/blogs/${id}`, { method: "DELETE" }),
  },
  brands: {
    getAll: (params: Record<string, unknown> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value.toString());
      });
      return fetchApi(`/brands?${query.toString()}`);
    },
    create: (data: unknown) => fetchApi("/brands", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/brands/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/brands/${id}`, { method: "DELETE" }),
  },
  contactInfo: {
    get: () => fetchApi("/contact-info"),
    update: (data: unknown) => fetchApi("/contact-info", { method: "PUT", body: JSON.stringify(data) }),
  },
  payments: {
    createPaymentIntent: (amount: number) =>
      fetchApi("/payments/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
  },
  stores: {
    getMyStore: () => fetchApi("/stores/my-store"),
    create: (data: unknown) => fetchApi("/stores", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchApi(`/stores/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },
  notifications: {
    getAll: () => fetchApi("/notifications"),
    getUnreadCount: () => fetchApi("/notifications/unread-count"),
    markAsRead: (notificationId: string) => fetchApi(`/notifications/${notificationId}/read`, { method: "PATCH" }),
    markAllAsRead: () => fetchApi("/notifications/read-all", { method: "PATCH" }),
  },
  withdrawals: {
    getWallet: () => fetchApi("/withdrawals/wallet"),
    getEarnings: () => fetchApi("/withdrawals/earnings"),
    getHistory: () => fetchApi("/withdrawals/history"),
    addBank: (data: unknown) => fetchApi("/withdrawals/bank", { method: "POST", body: JSON.stringify(data) }),
    removeBank: (bankId: string) => fetchApi(`/withdrawals/bank/${bankId}`, { method: "DELETE" }),
    requestWithdrawal: (amount: number, bankDetailsId: string) =>
      fetchApi("/withdrawals/withdraw", {
        method: "POST",
        body: JSON.stringify({ amount, bankDetailsId }),
      }),
  },
};

