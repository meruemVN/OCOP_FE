<template>
  <div class="container-fluid py-4">
    <h1 class="h3 mb-3 text-gray-800">
      <i class="fas fa-user-tie me-2"></i>Quản lý Yêu cầu Nhà Phân Phối
    </h1>
    <p class="text-muted mb-4">
      Xem và duyệt các yêu cầu đăng ký làm nhà phân phối.
    </p>

    <div class="card shadow-sm border-light">
      <div class="card-header bg-light py-3">
        <h6 class="m-0 font-weight-bold text-primary">Danh sách Yêu cầu</h6>
        <!-- Thêm filter theo status nếu cần -->
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Đang tải danh sách yêu cầu...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else-if="requests.length === 0" class="text-center py-5">
          <i class="fas fa-folder-open fa-3x text-light mb-3"></i>
          <p>Không có yêu cầu nào.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Người Yêu Cầu</th>
                <th>Công ty / MST</th>
                <th>Email</th>
                <th>Ngày Yêu Cầu</th>
                <th class="text-center">Trạng thái</th>
                <th class="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requests" :key="request._id">
                <td>{{ request.name }}</td>
                <td>
                    <div>{{ request.distributorInfo?.companyName || 'N/A' }}</div>
                    <small class="text-muted">MST: {{ request.distributorInfo?.taxId || 'N/A' }}</small>
                </td>
                <td>{{ request.email }}</td>
                <td>{{ formatDate(request.distributorInfo?.requestDate) }}</td>
                <td class="text-center">
                  <span :class="['badge', getRequestStatusBadgeClass(request.distributorInfo?.status)]">
                    {{ getRequestStatusText(request.distributorInfo?.status) }}
                  </span>
                </td>
                <td class="text-center">
                  <router-link :to="{ name: 'AdminDistributorRequestDetail', params: { id: request._id } }" class="btn btn-sm btn-outline-primary" title="Xem & Duyệt">
                    <i class="fas fa-search-plus"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination Component -->
         <div v-if="!loading && totalPages > 1" class="mt-4 d-flex justify-content-center">
            <nav>
                <ul class="pagination">
                    <li class="page-item" :class="{disabled: currentPage === 1}">
                        <a class="page-link" href="#" @click.prevent="fetchRequests(currentPage - 1)">Trước</a>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page" :class="{active: currentPage === page}">
                        <a class="page-link" href="#" @click.prevent="fetchRequests(page)">{{page}}</a>
                    </li>
                    <li class="page-item" :class="{disabled: currentPage === totalPages}">
                        <a class="page-link" href="#" @click.prevent="fetchRequests(currentPage + 1)">Sau</a>
                    </li>
                </ul>
            </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import apiClient from '@/services/apiClient';

// --- MOCK API CLIENT ---
const apiClient = {
  get: async (url) => {
    console.log(`[MockApiClient] GET ${url}`); // ví dụ /api/admin/distributor-requests?page=1&limit=10
    await new Promise(resolve => setTimeout(resolve, 600));
    const page = parseInt(new URLSearchParams(url.split('?')[1]).get('page')) || 1;
    const limit = 10;
    const totalRequests = 15;
    const totalPages = Math.ceil(totalRequests / limit);
    let mockRequests = [];
     for(let i = 0; i < limit; i++) {
        const reqIdNum = (page - 1) * limit + i + 1;
        if (reqIdNum > totalRequests) break;
        mockRequests.push({
            _id: `mockreq${reqIdNum.toString().padStart(2,'0')}`,
            name: `Người Yêu Cầu ${reqIdNum}`,
            email: `requester${reqIdNum}@example.com`,
            distributorInfo: {
                companyName: `Công ty ABC ${reqIdNum}`,
                taxId: `MST${reqIdNum}`,
                requestDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)]
            }
        });
    }
    return { data: { requests: mockRequests, page, pages: totalPages, count: totalRequests } };
  }
};
// --- END MOCK API CLIENT ---

const requests = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const limitPerPage = 10;

const fetchRequests = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    // API của bạn có thể là /api/admin/users?role=distributor hoặc /api/admin/distributor-requests
    const response = await apiClient.get(`/api/admin/distributor-requests?page=${page}&limit=${limitPerPage}`);
    // Tùy chỉnh key 'requests' hoặc 'users' dựa trên API của bạn
    const dataKey = response.data.requests ? 'requests' : (response.data.users ? 'users' : null);

    if (response.data && dataKey && response.data[dataKey]) {
      requests.value = response.data[dataKey];
      currentPage.value = response.data.page;
      totalPages.value = response.data.pages;
    } else {
        requests.value = [];
        totalPages.value = 1;
        console.warn("AdminDistributorRequestList: No requests/users array in response or unexpected structure.");
    }
  } catch (err) {
    console.error("AdminDistributorRequestList: Error fetching requests:", err);
    error.value = "Không thể tải danh sách yêu cầu.";
    requests.value = [];
  } finally {
    loading.value = false;
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
  fetchRequests();
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>