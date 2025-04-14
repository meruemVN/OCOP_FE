// services/auth.service.js
import api from './api';

class AuthService {
  async login(credentials) {
    return await api.post('/auth/login', credentials);
  }
  
  async register(userData) {
    return await api.post('/auth/register', userData);
  }
  
  async updateProfile(userData) {
    return await api.put('/auth/profile', userData);
  }
  
  async getProfile() {
    return await api.get('/auth/profile');
  }
  
  async changePassword(passwordData) {
    return await api.post('/auth/change-password', passwordData);
  }
  
  async registerDistributor(distributorData) {
    return await api.post('/auth/distributor-register', distributorData);
  }
  
  async registerSeller(sellerData) {
    return await api.post('/auth/seller-register', sellerData);
  }
}

export default new AuthService();