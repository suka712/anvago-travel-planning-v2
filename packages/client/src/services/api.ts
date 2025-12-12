import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('anvago-refresh-token');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
          const { accessToken } = response.data.data.tokens;
          
          // Update token in storage
          const authData = JSON.parse(localStorage.getItem('anvago-auth') || '{}');
          authData.state.accessToken = accessToken;
          localStorage.setItem('anvago-auth', JSON.stringify(authData));
          
          // Retry original request
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          // Refresh failed, clear auth
          localStorage.removeItem('anvago-auth');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

export const onboardingApi = {
  getQuestions: () => api.get('/onboarding/questions'),
  getVibes: (city?: string) => api.get('/onboarding/vibes', { params: { city } }),
  getContext: (city?: string) => api.get('/onboarding/context', { params: { city } }),
  submit: (answers: Record<string, unknown>) => api.post('/onboarding/submit', answers),
};

export const locationsApi = {
  list: (params?: Record<string, unknown>) => api.get('/locations', { params }),
  search: (q: string, params?: Record<string, unknown>) => 
    api.get('/locations/search', { params: { q, ...params } }),
  get: (id: string) => api.get(`/locations/${id}`),
  nearby: (lat: number, lng: number, radiusKm?: number) => 
    api.get('/locations/nearby', { params: { lat, lng, radiusKm } }),
  featured: (city?: string) => api.get('/locations/featured', { params: { city } }),
  categories: () => api.get('/locations/categories'),
};

export const itinerariesApi = {
  templates: (city?: string) => api.get('/itineraries/templates', { params: { city } }),
  generate: (preferences: Record<string, unknown>) => 
    api.post('/itineraries/generate', preferences),
  list: () => api.get('/itineraries'),
  get: (id: string) => api.get(`/itineraries/${id}`),
  create: (data: Record<string, unknown>) => api.post('/itineraries', data),
  update: (id: string, data: Record<string, unknown>) => 
    api.patch(`/itineraries/${id}`, data),
  delete: (id: string) => api.delete(`/itineraries/${id}`),
  duplicate: (id: string) => api.post(`/itineraries/${id}/duplicate`),
  optimize: (id: string, criterion: string) => 
    api.post(`/itineraries/${id}/optimize`, { criterion }),
  localize: (id: string) => api.post(`/itineraries/${id}/localize`),
  
  // Items
  addItem: (itineraryId: string, data: Record<string, unknown>) => 
    api.post(`/itineraries/${itineraryId}/items`, data),
  updateItem: (itineraryId: string, itemId: string, data: Record<string, unknown>) => 
    api.patch(`/itineraries/${itineraryId}/items/${itemId}`, data),
  removeItem: (itineraryId: string, itemId: string) => 
    api.delete(`/itineraries/${itineraryId}/items/${itemId}`),
  reorderItems: (itineraryId: string, items: Array<{ id: string; dayNumber: number; orderIndex: number }>) => 
    api.post(`/itineraries/${itineraryId}/items/reorder`, { items }),
  getAlternatives: (itineraryId: string, itemId: string, type?: string) => 
    api.get(`/itineraries/${itineraryId}/items/${itemId}/alternatives`, { params: { type } }),
};

export const tripsApi = {
  list: (status?: string) => api.get('/trips', { params: { status } }),
  get: (id: string) => api.get(`/trips/${id}`),
  create: (data: { itineraryId: string; scheduledStart: string }) => 
    api.post('/trips', data),
  update: (id: string, data: Record<string, unknown>) => 
    api.patch(`/trips/${id}`, data),
  advance: (id: string) => api.post(`/trips/${id}/advance`),
  getEvents: (id: string) => api.get(`/trips/${id}/events`),
  addEvent: (id: string, data: Record<string, unknown>) => 
    api.post(`/trips/${id}/events`, data),
};

export const integrationsApi = {
  grabEstimate: (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) =>
    api.get('/integrations/grab/estimate', { params: { pickupLat, pickupLng, dropoffLat, dropoffLng } }),
  grabBook: (data: Record<string, unknown>) => api.post('/integrations/grab/book', data),
  searchAccommodations: (params: Record<string, unknown>) => 
    api.post('/integrations/booking/search', params),
  searchActivities: (params: Record<string, unknown>) => 
    api.post('/integrations/klook/activities', params),
};

export const externalApi = {
  weather: (city: string) => api.get(`/external/weather/${city}`),
  traffic: (city: string) => api.get(`/external/traffic/${city}`),
};

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
  itineraries: () => api.get('/admin/itineraries'),
  trips: () => api.get('/admin/trips'),
  locations: () => api.get('/admin/locations'),
  demoReset: () => api.post('/admin/demo/reset'),
  demoSimulate: (tripId: string, action: string, payload?: Record<string, unknown>) =>
    api.post('/admin/demo/simulate', { tripId, action, payload }),
  demoState: () => api.get('/admin/demo/state'),
};

