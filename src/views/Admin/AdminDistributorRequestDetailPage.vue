<template>
  <div class="container-fluid py-4">
    <h1 class="h3 mb-3 text-gray-800">
      <i class="fas fa-user-check me-2"></i>Chi tiết Yêu cầu Nhà Phân Phối
    </h1>
     <p class="mb-4">
      Xem xét và xử lý yêu cầu từ: {{ request?.name || 'Đang tải...' }}.
       <router-link :to="{name: 'AdminDistributorRequests'}" class="ms-2 small">« Quay lại danh sách</router-link>
    </p>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-2">Đang tải chi tiết yêu cầu...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
    </div>
    <div v-else-if="!request" class="alert alert-warning">
      <i class="fas fa-info-circle me-2"></i>Không tìm thấy thông tin yêu cầu.
    </div>

    <div v-else class="card shadow-sm border-light">
      <div class="card-header bg-light py-3 d-flex justify-content-between align-items-center">
        <h6 class="m-0 font-weight-bold text-primary">Thông tin Yêu cầu</h6>
         <span :class="['badge fs-6', getRequestStatusBadgeClass(request.distributorInfo?.status)]">
            {{ getRequestStatusText(request.distributorInfo?.status) }}
        </span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h5>Thông tin Người Dùng:</h5>
            <p><strong>Tên:</strong> {{ request.name }}</p>
            <p><strong>Email:</strong> {{ request.email }}</p>
            <p><strong>Ngày đăng ký tài khoản:</strong> {{ formatDate(request.createdAt) }}</p>
            <p><strong>Vai trò hiện tại:</strong> {{ request.role }}</p>
          </div>
          <div class="col-md-6">
            <h5>Thông tin Nhà Phân Phối:</h5>
            <p><strong>Tên công ty/HKD:</strong> {{ request.distributorInfo?.companyName || 'N/A' }}</p>
            <p><strong>Mã số thuế:</strong> {{ request.distributorInfo?.taxId || 'N/A' }}</p>
            <p><strong>Giấy phép KD:</strong> {{ request.distributorInfo?.businessLicense || 'N/A' }}</p>
            <p><strong>Khu vực phân phối:</strong> {{ request.distributorInfo?.distributionArea || 'N/A' }}</p>
            <p><strong>Ngày gửi yêu cầu NPP:</strong> {{ formatDate(request.distributorInfo?.requestDate) }}</p>
          </div>
        </div>
        <hr>
        <div v-if="request.distributorInfo?.status === 'pending'" class="mt-4 text-center">
          <h5 class="mb-3">Hành động:</h5>
          <button class="btn btn-success me-2" @click="handleUpdateRequest('approved')" :disabled="processingAction">
            <span v-if="processingAction && currentAction === 'approved'" class="spinner-border spinner-border-sm"></span>
            <i class="fas fa-check-circle me-1"></i>Duyệt Yêu Cầu
          </button>
          <button class="btn btn-danger" @click="handleUpdateRequest('rejected')" :disabled="processingAction">
            <span v-if="processingAction && currentAction === 'rejected'" class="spinner-border spinner-border-sm"></span>
            <i class="fas fa-times-circle me-1"></i>Từ Chối
          </button>
           <p v-if="actionError" class="text-danger mt-2 small">{{ actionError }}</p>
        </div>
         <div v-else class="mt-3">
            <p class="text-muted">Yêu cầu này đã được xử lý (Trạng thái: {{ getRequestStatusText(request.distributorInfo?.status) }}).</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import apiClient from '@/services/apiClient';
// import { useToast } from 'vue-toastification';

// const toast = useToast();
const route = useRoute();
const router = useRouter();

// --- MOCK API CLIENT ---
const apiClient = {
  get: async (url) => { // ví dụ /api/admin/distributor-requests/mockreq01
    console.log(`[MockApiClient] GET ${url}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const reqId = url.split('/').pop();
     if (reqId.startsWith('mockreq')) {
        return { data: {
            _id: reqId,
            name: `Người Yêu Cầu ${reqId.slice(-2)}`,
            email: `requester${reqId.slice(-2)}@example.com`,
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
            role: 'user', // Giả sử vai trò ban đầu là user
            distributorInfo: {
                companyName: `Công ty ABC ${reqId.slice(-2)}`,
                taxId: `MST${reqId.slice(-2)}`,
                businessLicense: `GPKD-${reqId.slice(-2)}`,
                distributionArea: `Khu Vực ${reqId.slice(-2)}`,
                requestDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending' // Giả sử mặc định là pending để có thể duyệt
            }
        }};
    }
    return { data: null };
  },
  put: async (url, payload) => { // ví dụ /api/admin/distributor-requests/mockreq01/manage
    console.log(`[MockApiClient] PUT ${url} with payload:`, payload);
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (Math.random() > 0.1) {
        return { data: { message: `Yêu cầu đã được ${payload.status === 'approved' ? 'duyệt' : 'từ chối'}.`, status: payload.status } };
    } else {
        throw { response: { data: { message: "Lỗi giả lập từ server khi xử lý yêu cầu." } } };
    }
  }
};
// --- END MOCK API CLIENT ---

const requestId = ref(route.params.id);
const request = ref(null);
const loading = ref(true);
const error = ref(null);
const processingAction = ref(false);
const currentAction = ref('');
const actionError = ref(null);


const fetchRequestDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    // API endpoint của bạn có thể là /api/admin/users/:id hoặc /api/admin/distributor-requests/:id
    const response = await apiClient.get(`/api/admin/distributor-requests/${requestId.value}`);
    if (response.data) {
      request.value = response.data;
    } else {
      error.value = "Không tìm thấy yêu cầu.";
    }
  } catch (err) {
    console.error("AdminDistributorRequestDetailPage: Error fetching request detail:", err);
    error.value = err.response?.data?.message || "Lỗi tải chi tiết yêu cầu.";
  } finally {
    loading.value = false;
  }
};

const handleUpdateRequest = async (newStatus) => {
  if (!request.value) return;
  processingAction.value = true;
  currentAction.value = newStatus;
  actionError.value = null;

  try {
    // API endpoint của bạn: /api/admin/users/:userId/manage-distributor (nếu request là user)
    // hoặc /api/admin/distributor-requests/:requestId/status
    const response = await apiClient.put(`/api/admin/distributor-requests/${requestId.value}/manage`, { status: newStatus });
    // Cập nhật lại trạng thái của request trên UI
    if (request.value.distributorInfo) {
        request.value.distributorInfo.status = newStatus;
    }
    // toast.success(response.data.message || `Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} yêu cầu.`);
    alert(response.data.message || `Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} yêu cầu.`);

  } catch (err) {
    console.error("AdminDistributorRequestDetailPage: Error updating request status:", err);
    actionError.value = err.response?.data?.message || "Lỗi xử lý yêu cầu.";
    // toast.error(actionError.value);
  } finally {
    processingAction.value = false;
    currentAction.value = '';
  }
};

// Helper functions
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A';
const getRequestStatusText = (status) => {
  const map = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
  return map[status] || status;
};
const getRequestStatusBadgeClass = (status) => {
  const map = { pending: 'bg-warning-subtle text-warning-emphasis', approved: 'bg-success-subtle text-success-emphasis', rejected: 'bg-danger-subtle text-danger-emphasis' };
  return map[status] || 'bg-secondary-subtle text-secondary-emphasis';
};

onMounted(() => {
  fetchRequestDetail();
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>