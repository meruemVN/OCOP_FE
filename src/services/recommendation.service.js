// src/services/recommendation.service.js
import axios from 'axios'; // Hoặc HTTP client bạn dùng (fetch)

const API_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000/api'; 

class RecommendationService {
  getRecommendations(productId, topN = 5) {
    if (!productId) {
      return Promise.reject(new Error("Product ID is required for recommendations."));
    }
    return axios.get(`${API_URL}/recommendations/${productId}`, {
      params: { top_n: topN }
    })
    .then(response => response.data)
    .catch(error => {
        console.error(`Error fetching recommendations for product ${productId}:`, error.response?.data || error.message);
        throw error.response?.data || error; // Ném lại lỗi để action trong Vuex xử lý
    });
  }

  // (Thêm các hàm khác nếu cần, ví dụ getProducts nếu bạn chưa có service riêng cho product)
}

export default new RecommendationService();