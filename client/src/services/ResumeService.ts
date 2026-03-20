import apiClient from '../lib/apiClient';

export class ResumeService {
  static async list() {
    const response = await apiClient.get('/resumes');
    return response.data;
  }

  static async create(data: any) {
    const response = await apiClient.post('/resumes', data);
    return response.data;
  }

  static async getById(id: string) {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  }

  static async update(id: string, data: any) {
    const response = await apiClient.patch(`/resumes/${id}`, data);
    return response.data;
  }

  static async delete(id: string) {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  }

  static async duplicate(id: string) {
    const response = await apiClient.post(`/resumes/${id}/duplicate`);
    return response.data;
  }
}
