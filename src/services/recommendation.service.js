// src/services/recommendation.service.js
import apiClient from './api'; // <<< SỬ DỤNG apiClient ĐÃ CẤU HÌNH

class RecommendationService {
  async getRecommendations(productId, topN = 5) { // Thay đổi thành async/await cho nhất quán
    if (!productId) {
      return Promise.reject(new Error("Product ID is required for recommendations."));
    }
    try {
      // Backend route đã thống nhất là /recommendations/product/:productId
      const response = await apiClient.get(`/recommendations/product/${productId}`, {
        params: { top_n: topN }
      });
      // apiClient trả về response đầy đủ, nên cần .data
      // Backend controller trả về { recommendations: [...] }
      return response.data; 
    } catch (error) {
      console.error(`[FE Service Rec] Error fetching product recommendations for ${productId}:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  async getUserRecommendations(userId, topN = 4) { // Thêm hàm này nếu chưa có
    if (!userId) {
      return Promise.reject(new Error('User ID is required for user-specific recommendations.'));
    }
    try {
      // Backend route là /recommendations/user/:userId
      const response = await apiClient.get(`/recommendations/user/${userId}`, {
        params: { top_n: topN },
      });
      // Backend controller trả về { recommendations: [...] }
      return response.data;
    } catch (error) {
      console.error(`[FE Service Rec] Error fetching user recommendations for ${userId}:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
}

export default new RecommendationService();