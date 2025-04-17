<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 text-success fw-semibold mb-0">
        <i class="fas fa-boxes me-2"></i>Quản lý sản phẩm
      </h2>
      <button class="btn btn-success" @click="openAddProductModal">
        <i class="fas fa-plus me-1"></i> Thêm sản phẩm mới
      </button>
    </div>
    <p class="text-muted mb-4">Thêm, sửa, xóa và cập nhật sản phẩm bạn đang phân phối.</p>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải danh sách sản phẩm...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-5 card border-light shadow-sm">
       <div class="card-body">
           <i class="fas fa-box-open fa-3x text-light mb-3"></i>
           <p class="text-muted">Bạn chưa có sản phẩm nào.</p>
           <button class="btn btn-success mt-2" @click="openAddProductModal">
               <i class="fas fa-plus me-1"></i> Thêm sản phẩm đầu tiên
           </button>
       </div>
    </div>

    <!-- Products Table -->
    <div v-else class="card shadow-sm border-light">
        <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle mb-0">
                <thead class="table-light">
                <tr>
                    <th scope="col" style="min-width: 200px;">Tên sản phẩm</th>
                    <th scope="col">Danh mục</th>
                    <th scope="col" class="text-end">Giá</th>
                    <th scope="col" class="text-center">Tồn kho</th>
                    <th scope="col" class="text-center">Đã bán</th>
                    <th scope="col" class="text-center" style="width: 120px;">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in products" :key="product._id">
                    <td>
                        <div class="d-flex align-items-center">
                           <img :src="getProductImage(product)"
                                :alt="product.name"
                                class="rounded border me-2 flex-shrink-0"
                                style="width: 40px; height: 40px; object-fit: cover; background-color: #f8f9fa;"
                                @error="onImageError">
                           <span class="fw-medium text-dark text-truncate" :title="product.name">
                              {{ product.name }}
                           </span>
                        </div>
                    </td>
                    <td>{{ product.category || 'N/A' }}</td>
                    <td class="text-end">{{ formatCurrency(product.price) }}</td>
                    <td class="text-center">{{ product.countInStock }}</td>
                    <td class="text-center">{{ product.sold || 0 }}</td>
                    <td class="text-center">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="openEditProductModal(product)" title="Sửa">
                           <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="confirmDeleteProduct(product)" title="Xóa">
                           <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    </td>
                </tr>
                </tbody>
            </table>
      </div>
    </div>

    <!-- Modal thêm/sửa sản phẩm (Bootstrap 5) -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true" ref="productModalRef">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-success fw-semibold" id="productModalLabel">
                   <i class="fas me-2" :class="form._id ? 'fa-edit' : 'fa-plus-circle'"></i>
                   {{ form._id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="submitProductForm" class="needs-validation" novalidate ref="productFormRef">
                    <!-- Product Name -->
                    <div class="mb-3">
                        <label for="productName" class="form-label">Tên sản phẩm <span class="text-danger">*</span></label>
                        <input type="text" id="productName" v-model.trim="form.name" class="form-control" required placeholder="Nhập tên sản phẩm">
                         <div class="invalid-feedback">Vui lòng nhập tên sản phẩm.</div>
                    </div>
                    <!-- Category -->
                     <div class="mb-3">
                        <label for="productCategory" class="form-label">Danh mục <span class="text-danger">*</span></label>
                        <input type="text" id="productCategory" v-model.trim="form.category" class="form-control" required placeholder="Ví dụ: Nông sản khô, Thủ công mỹ nghệ">
                         <div class="invalid-feedback">Vui lòng nhập danh mục.</div>
                    </div>
                     <!-- Description -->
                    <div class="mb-3">
                        <label for="productDescription" class="form-label">Mô tả <span class="text-danger">*</span></label>
                        <textarea id="productDescription" v-model.trim="form.description" class="form-control" rows="4" required placeholder="Mô tả chi tiết về sản phẩm..."></textarea>
                        <div class="invalid-feedback">Vui lòng nhập mô tả sản phẩm.</div>
                    </div>
                    <!-- Price & Stock -->
                    <div class="row g-3 mb-3">
                         <div class="col-md-4">
                             <label for="productPrice" class="form-label">Giá (VNĐ) <span class="text-danger">*</span></label>
                             <input type="number" id="productPrice" v-model.number="form.price" min="0" step="1000" class="form-control" required>
                              <div class="invalid-feedback">Vui lòng nhập giá hợp lệ (>= 0).</div>
                         </div>
                         <div class="col-md-4">
                             <label for="productStock" class="form-label">Tồn kho <span class="text-danger">*</span></label>
                             <input type="number" id="productStock" v-model.number="form.countInStock" min="0" class="form-control" required>
                              <div class="invalid-feedback">Vui lòng nhập số lượng tồn kho (>= 0).</div>
                         </div>
                         <div class="col-md-4">
                             <label for="productSold" class="form-label">Đã bán</label>
                             <input type="number" id="productSold" v-model.number="form.sold" min="0" class="form-control">
                             <div class="invalid-feedback">Vui lòng nhập số lượng đã bán (>= 0).</div>
                         </div>
                    </div>
                     <!-- Images (Simple URL input for now) -->
                     <div class="mb-3">
                         <label for="productImages" class="form-label">Link ảnh (cách nhau bởi dấu phẩy)</label>
                         <input type="text" id="productImages" v-model="imageInput" class="form-control" placeholder="https://link1.jpg, https://link2.png">
                         <div class="form-text">Nhập các link ảnh, cách nhau bởi dấu phẩy. Ảnh đầu tiên sẽ là ảnh đại diện.</div>
                     </div>

                    <div class="modal-footer px-0 pb-0">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
                           <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                           <i v-else class="fas me-2" :class="form._id ? 'fa-save' : 'fa-plus'"></i>
                           {{ isSubmitting ? 'Đang lưu...' : (form._id ? 'Cập nhật' : 'Thêm mới') }}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '@/services/api'; // Đảm bảo import đúng tên và đường dẫn
import { useToast } from 'vue-toastification';
// Import Bootstrap Modal JS (chỉ cần import nếu điều khiển bằng JS, data-bs-toggle hoạt động không cần import này)
import { Modal } from 'bootstrap';
// Import icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxes, faPlus, faEdit, faTrash, faSave, faPlusCircle, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

library.add(faBoxes, faPlus, faEdit, faTrash, faSave, faPlusCircle, faBoxOpen);


const toast = useToast();
const products = ref([]); // Ref để lưu danh sách sản phẩm
const loading = ref(true); // Trạng thái loading cho cả trang
const productModalRef = ref(null); // Ref cho DOM element của modal
const productFormRef = ref(null); // Ref cho DOM element của form trong modal
let productModalInstance = null; // Instance của Bootstrap Modal

// Form state
const initialFormState = {
  _id: null,
  name: '',
  category: '',
  description: '', // Thêm description
  price: 0,
  countInStock: 0,
  sold: 0,
  images: [], // Lưu dưới dạng mảng URLs
};
const form = ref({ ...initialFormState });
const imageInput = ref(''); // Input riêng cho chuỗi link ảnh
const isSubmitting = ref(false); // Trạng thái loading cho form submit

// Placeholder image
const placeholderImage = '/images/placeholder.png'; // Đảm bảo có ảnh này trong public/images

// --- Methods ---

// Fetch products từ backend
async function fetchProducts() {
  loading.value = true;
  try {
    // Endpoint này cần backend hỗ trợ trả về sản phẩm của distributor hiện tại
    const response = await apiClient.get('/products/my-products');
    // Gán response.data (phải là mảng)
    products.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    toast.error(err.response?.data?.message || 'Không thể tải danh sách sản phẩm.');
    products.value = []; // Đặt về rỗng khi lỗi
  } finally {
    loading.value = false;
  }
}

// Format tiền tệ
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Lấy ảnh hiển thị (ảnh đầu tiên hoặc placeholder)
function getProductImage(product) {
    return product.images?.[0] || placeholderImage;
}

// Xử lý lỗi ảnh
function onImageError(event) {
   event.target.src = placeholderImage;
}

// Reset form về trạng thái ban đầu
function resetForm() {
  form.value = { ...initialFormState };
  imageInput.value = ''; // Reset cả input ảnh
   // Reset validation state của form
   productFormRef.value?.classList.remove('was-validated');
}

// Mở modal để thêm sản phẩm
function openAddProductModal() {
  resetForm();
  productModalInstance?.show();
}

// Mở modal để sửa sản phẩm
function openEditProductModal(product) {
  // Deep copy để tránh thay đổi trực tiếp product gốc
  form.value = JSON.parse(JSON.stringify(product));
  // Chuyển mảng images thành chuỗi để hiển thị trong input
  imageInput.value = form.value.images?.join(', ') || '';
  productModalInstance?.show();
   // Reset validation state
   productFormRef.value?.classList.remove('was-validated');
}

// Đóng modal
function closeDialog() {
  productModalInstance?.hide();
  // Việc reset form sẽ được xử lý bởi event 'hidden.bs.modal'
}

// Xử lý submit form (Thêm mới hoặc Cập nhật)
async function submitProductForm(event) {
   const formElement = event.target;
   if (!formElement.checkValidity()) {
       event.preventDefault();
       event.stopPropagation();
       formElement.classList.add('was-validated');
       return;
   }
   formElement.classList.add('was-validated');

  isSubmitting.value = true;
  try {
    // Chuyển chuỗi ảnh thành mảng URLs
    const imagesArray = imageInput.value
                        .split(',')
                        .map(url => url.trim())
                        .filter(url => url); // Lọc bỏ link rỗng

    const productData = { ...form.value, images: imagesArray };

    if (form.value._id) {
      // --- Cập nhật sản phẩm ---
      const response = await apiClient.put(`/products/${form.value._id}`, productData);
      // Cập nhật lại product trong danh sách products.value
      const index = products.value.findIndex(p => p._id === form.value._id);
      if (index !== -1) {
        products.value.splice(index, 1, response.data); // Thay thế bằng data mới từ API
      }
      toast.success('Đã cập nhật sản phẩm thành công!');
    } else {
      // --- Thêm sản phẩm mới ---
      // Loại bỏ _id trước khi gửi đi tạo mới
      const { _id, ...newProductData } = productData;
      const response = await apiClient.post('/products', newProductData);
       // Thêm product mới vào đầu danh sách
       products.value.unshift(response.data);
      toast.success('Đã thêm sản phẩm thành công!');
    }
    closeDialog();
    // Không cần fetch lại toàn bộ list nếu đã cập nhật/thêm thành công
    // await fetchProducts();
  } catch (err) {
    console.error('Lỗi lưu sản phẩm:', err);
    toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
  } finally {
    isSubmitting.value = false;
     formElement.classList.remove('was-validated'); // Reset validation sau khi submit
  }
}

// Xác nhận và xóa sản phẩm
async function confirmDeleteProduct(product) {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không? Hành động này không thể hoàn tác.`)) {
    try {
      await apiClient.delete(`/products/${product._id}`);
      // Xóa khỏi danh sách products.value
      products.value = products.value.filter(p => p._id !== product._id);
      toast.success(`Đã xóa sản phẩm "${product.name}".`);
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
      toast.error(err.response?.data?.message || 'Không thể xóa sản phẩm.');
    }
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchProducts(); // Tải sản phẩm khi component được mount

  // Khởi tạo instance Modal của Bootstrap
  const modalElement = productModalRef.value;
  if (modalElement) {
    productModalInstance = new Modal(modalElement);

    // Thêm listener để reset form khi modal ẩn đi
    modalElement.addEventListener('hidden.bs.modal', () => {
       resetForm();
       isSubmitting.value = false; // Reset trạng thái submit
    });
  }
});

// --- Watchers (Optional) ---
// Có thể thêm watcher để xử lý logic phức tạp hơn nếu cần
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
.table th {
    font-weight: 600; /* Chữ thead đậm hơn */
    white-space: nowrap; /* Ngăn xuống dòng ở header */
}
.table td {
    vertical-align: middle;
}
.modal-dialog {
    max-width: 650px; /* Kích thước modal lớn hơn */
}
.product-name {
    max-width: 250px; /* Giới hạn chiều rộng tên SP trong bảng */
}
/* Responsive cho table (nếu cần) */
/* @media (max-width: 768px) { ... } */
</style>