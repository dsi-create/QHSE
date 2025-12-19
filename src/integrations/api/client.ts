// Client API pour remplacer Supabase
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Récupérer le token depuis localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || 'Erreur lors de la requête');
    }

    return response.json();
  }

  // Authentification
  async signIn(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async signUp(userData: any) {
    const data = await this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async signOut() {
    await this.request('/auth/signout', { method: 'POST' });
    this.setToken(null);
  }

  async updatePassword(password: string) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  // Profils
  async getProfiles() {
    return this.request<any[]>('/profiles');
  }

  async getProfile(id: string) {
    return this.request<any>(`/profiles/${id}`);
  }

  async updateProfile(id: string, data: any) {
    return this.request(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProfile(id: string) {
    return this.request(`/profiles/${id}`, {
      method: 'DELETE',
    });
  }

  // Incidents
  async getIncidents() {
    return this.request<any[]>('/incidents');
  }

  async createIncident(incident: any) {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    });
  }

  async updateIncident(id: string, data: any) {
    return this.request(`/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await fetch(`${API_BASE_URL}/incidents/upload-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload des images');
    }

    return response.json();
  }

  // Visiteurs
  async getVisitors() {
    return this.request<any[]>('/visitors');
  }

  async createVisitor(visitor: any) {
    return this.request('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitor),
    });
  }

  async signOutVisitor(id: string) {
    return this.request(`/visitors/${id}/signout`, {
      method: 'PUT',
    });
  }

  // Équipements biomédicaux
  async getBiomedicalEquipment() {
    return this.request<any[]>('/biomedical-equipment');
  }

  async createBiomedicalEquipment(equipment: any) {
    return this.request('/biomedical-equipment', {
      method: 'POST',
      body: JSON.stringify(equipment),
    });
  }

  async updateBiomedicalEquipmentStatus(id: string, status: string) {
    return this.request(`/biomedical-equipment/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Tâches de maintenance
  async getMaintenanceTasks() {
    return this.request<any[]>('/maintenance-tasks');
  }

  async createMaintenanceTask(task: any) {
    return this.request('/maintenance-tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  // Salles
  async getRooms() {
    return this.request<any[]>('/rooms');
  }

  // Médecins
  async getDoctors() {
    return this.request<any[]>('/doctors');
  }

  // Réservations
  async getBookings() {
    return this.request<any[]>('/bookings');
  }

  async createBooking(booking: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id: string, booking: any) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Tâches planifiées
  async getPlannedTasks() {
    return this.request<any[]>('/planned-tasks');
  }

  async createPlannedTask(task: any) {
    return this.request('/planned-tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updatePlannedTask(id: string, data: any) {
    return this.request(`/planned-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlannedTask(id: string) {
    return this.request(`/planned-tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async createNotification(notification: any) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  async markNotificationsAsRead() {
    return this.request('/notifications/mark-read', {
      method: 'PUT',
    });
  }

  // Ensure superadmin
  async ensureSuperadmin() {
    return this.request<{ success: boolean; message: string }>('/ensure-superadmin', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();


