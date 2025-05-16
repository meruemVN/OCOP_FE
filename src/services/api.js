import axios from 'axios';
import store from '@/store'; // Import store để dispatch logout

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Quan trọng: Thêm withCredentials nếu backend cần đọc/ghi cookie token
  // Backend của bạn có đọc cookie trong middleware `protect`, nên cần bật cái này
  withCredentials: true
});

// ----- Request Interceptor -----
// Nhiệm vụ: Đính kèm token vào header Authorization nếu có trong localStorage.
// Lý do dùng localStorage: Đảm bảo token được gửi ngay lập tức, tránh race condition
// với việc khởi tạo state Vuex từ localStorage khi refresh trang.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ưu tiên kiểm tra localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('[REQUEST INTERCEPTOR] Token from localStorage added'); // Bỏ comment để debug
    } else {
      // console.warn('[REQUEST INTERCEPTOR] No token found in localStorage.'); // Bỏ comment để debug
      // Không cần làm gì thêm, server sẽ tự kiểm tra cookie nếu cần
    }
    return config;
  },
  (error) => {
    console.error('[REQUEST INTERCEPTOR] Error:', error);
    return Promise.reject(error);
  }
);

// ----- Response Interceptor -----
// Nhiệm vụ 1: Trả về toàn bộ đối tượng response Axios khi thành công.
// Nhiệm vụ 2: Bắt lỗi 401 Unauthorized, dispatch action logout, và reject lỗi.
apiClient.interceptors.response.use(
  (response) => {
    console.log('[RESPONSE INTERCEPTOR] Success. Returning full response:', response); // << THÊM LOG NÀY
    return response; // Phải return response
  },
  (error) => {
    // Kiểm tra nếu có response lỗi và mã trạng thái là 401
    if (error.response && error.response.status === 401) {
      console.warn('API Interceptor: Unauthorized (401). Dispatching logout...');

      // Kiểm tra xem người dùng có đang thực sự đăng nhập trong state không
      // và có đang ở trang login không để tránh vòng lặp
      if (store.getters['auth/isLoggedIn'] && window.location.pathname !== '/login') {
         // Dispatch action logout từ Vuex store
         // Action này sẽ xử lý việc xóa state, localStorage và redirect
         store.dispatch('auth/logout');
         console.log('API Interceptor: Logout action dispatched.');
      } else {
         console.log('API Interceptor: User not logged in state or already on login page. Logout dispatch skipped.');
      }
    } else {
        // Log các lỗi khác nếu cần
        console.error('API Interceptor Response Error:', error);
    }

    // Luôn trả về lỗi để các hàm gọi .catch() có thể xử lý tiếp
    return Promise.reject(error);
  }
);

export default apiClient;