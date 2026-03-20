import apiClient from '../lib/apiClient';

export class AuthService {
  static async signup(data: any) {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  }

  static async login(data: any) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  }

  static async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
}
