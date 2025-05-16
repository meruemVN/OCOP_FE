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
    <div v-else-if="!products || products.length === 0" class="text-center py-5 card border-light shadow-sm">
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
                    <th scope="col" class="text-center">Xuất xứ</th>
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
                           <span class="fw-medium text-dark text-truncate" :title="product.name" style="max-width: 200px; display: inline-block;">
                              {{ product.name }}
                           </span>
                        </div>
                    </td>
                    <td>{{ product.category || 'N/A' }}</td>
                    <td class="text-end">{{ formatCurrency(product.price) }}</td>
                    <td class="text-center">{{ product.countInStock }}</td>
                    <td class="text-center">{{ product.sold || 0 }}</td>
                    <td class="text-center">{{ product.origin || 'N/A' }}</td> 
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
                    <div class="row g-3 mb-3">
                        <div class="col-md-8">
                            <label for="productName" class="form-label">Tên sản phẩm <span class="text-danger">*</span></label>
                            <input type="text" id="productName" v-model.trim="form.name" class="form-control" required placeholder="Nhập tên sản phẩm">
                            <div class="invalid-feedback">Vui lòng nhập tên sản phẩm.</div>
                        </div>
                        <div class="col-md-4">
                            <label for="productOriginalId" class="form-label">ID Gốc (CSV) <span class="text-danger">*</span></label>
                            <input type="number" id="productOriginalId" v-model.number="form.original_id" class="form-control" required placeholder="ID từ file CSV">
                            <div class="invalid-feedback">Vui lòng nhập ID gốc (số).</div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label for="productCategory" class="form-label">Danh mục <span class="text-danger">*</span></label>
                            <input type="text" id="productCategory" v-model.trim="form.category" class="form-control" required placeholder="Ví dụ: Nông sản khô">
                            <div class="invalid-feedback">Vui lòng nhập danh mục.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="productOrigin" class="form-label">Xuất xứ</label>
                            <input type="text" id="productOrigin" v-model.trim="form.origin" class="form-control" placeholder="Ví dụ: Quảng Nam, Việt Nam">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="productDescription" class="form-label">Mô tả <span class="text-danger">*</span></label>
                        <textarea id="productDescription" v-model.trim="form.description" class="form-control" rows="3" required placeholder="Mô tả chi tiết về sản phẩm..."></textarea>
                        <div class="invalid-feedback">Vui lòng nhập mô tả sản phẩm.</div>
                    </div>

                    <div class="row g-3 mb-3">
                         <div class="col-md-4">
                             <label for="productPrice" class="form-label">Giá (VNĐ) <span class="text-danger">*</span></label>
                             <input type="number" id="productPrice" v-model.number="form.price" min="0" class="form-control" required>
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

                     <div class="mb-3">
                         <label for="productImages" class="form-label">Link ảnh (cách nhau bởi dấu phẩy)</label>
                         <input type="text" id="productImages" v-model="imageInput" class="form-control" placeholder="https://link1.jpg, https://link2.png">
                         <div class="form-text">Nhập các link ảnh, cách nhau bởi dấu phẩy. Ảnh đầu tiên sẽ là ảnh đại diện.</div>
                     </div>

                    <div class="modal-footer px-0 pb-0 mt-4">
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
import { ref, onMounted } from 'vue';
import apiClient from '@/services/api';
import { useToast } from 'vue-toastification';
import { Modal } from 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxes, faPlus, faEdit, faTrash, faSave, faPlusCircle, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

library.add(faBoxes, faPlus, faEdit, faTrash, faSave, faPlusCircle, faBoxOpen);

const toast = useToast();
const products = ref([]);
const loading = ref(true);
const productModalRef = ref(null);
const productFormRef = ref(null);
let productModalInstance = null;

// Phù hợp với Product Model mới và dữ liệu mẫu
const initialFormState = {
  _id: null,
  name: '',
  original_id: null, // Bắt buộc khi tạo mới
  category: '',
  description: '',
  price: null,
  countInStock: null,
  sold: 0,
  images: [],
  origin: '', // Thêm origin vào đây
  // Các trường đã bị loại bỏ: producer, short_description, product_url, ocop_rating, brand
};
const form = ref({ ...initialFormState });
const imageInput = ref('');
const isSubmitting = ref(false);

const placeholderImage = '/images/placeholder.png'; // Đảm bảo ảnh này có trong public/images/

async function fetchProducts() {
  loading.value = true;
  console.log('Fetching products...'); // Log bắt đầu
  try {
    const response = await apiClient.get('/products/my-products');
    console.log('API Response:', response); // Log toàn bộ response

    if (response && response.data && Array.isArray(response.data.products)) {
      products.value = response.data.products;
      console.log('Products loaded:', products.value); // Log sản phẩm đã tải
      if (products.value.length === 0) {
          toast.info('Bạn chưa có sản phẩm nào hoặc không tìm thấy sản phẩm nào.');
      }
    } else {
      products.value = [];
      console.warn("API response.data.products không phải là một mảng hoặc không tồn tại:", response.data);
      toast.info('Không có sản phẩm nào được tìm thấy hoặc dữ liệu không hợp lệ.');
    }
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
    if (err.response) {
        console.error("API Error Response Data:", err.response.data);
        console.error("API Error Response Status:", err.response.status);
        console.error("API Error Response Headers:", err.response.headers);
    } else if (err.request) {
        console.error("API Error Request:", err.request);
    } else {
        console.error('API Error Message:', err.message);
    }
    toast.error(err.response?.data?.message || 'Không thể tải danh sách sản phẩm. Vui lòng kiểm tra console.');
    products.value = [];
  } finally {
    loading.value = false;
  }
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

function getProductImage(product) {
    return product.images?.[0] || placeholderImage;
}

function onImageError(event) {
   event.target.src = placeholderImage;
}

function resetForm() {
  form.value = { ...initialFormState };
  imageInput.value = '';
  if (productFormRef.value) {
    productFormRef.value.classList.remove('was-validated');
  }
}

function openAddProductModal() {
  resetForm();
  productModalInstance?.show();
}

function openEditProductModal(product) {
  const productData = { ...initialFormState, ...JSON.parse(JSON.stringify(product)) };
  form.value = productData;
  imageInput.value = product.images?.join(', ') || '';
  if (productFormRef.value) {
    productFormRef.value.classList.remove('was-validated');
  }
  productModalInstance?.show();
}

function closeDialog() {
  productModalInstance?.hide();
}

async function submitProductForm() {
   const formElement = productFormRef.value;
   if (!formElement.checkValidity()) {
       formElement.classList.add('was-validated');
       return;
   }

  isSubmitting.value = true;
  try {
    const imagesArray = imageInput.value
                        .split(',')
                        .map(url => url.trim())
                        .filter(url => url);

    // Chuẩn bị productData phù hợp với model mới
    const productData = {
        name: form.value.name,
        original_id: Number(form.value.original_id), // Luôn gửi, backend yêu cầu
        category: form.value.category,
        description: form.value.description,
        price: Number(form.value.price) || 0,
        countInStock: Number(form.value.countInStock) || 0,
        images: imagesArray,
        // Các trường tùy chọn, chỉ gửi nếu có giá trị
        ...(form.value.sold !== null && form.value.sold !== undefined && { sold: Number(form.value.sold) }),
        ...(form.value.origin && { origin: form.value.origin }),
    };

    // Validate original_id phía client khi tạo mới (backend cũng sẽ validate)
    if (!form.value._id && (productData.original_id === undefined || productData.original_id === null || isNaN(productData.original_id))) {
        toast.error('Vui lòng nhập ID Gốc (CSV) hợp lệ cho sản phẩm mới.');
        isSubmitting.value = false;
        const originalIdInput = formElement.querySelector('#productOriginalId');
        if (originalIdInput) originalIdInput.classList.add('is-invalid');
        return;
    }


    if (form.value._id) { // Cập nhật
      const response = await apiClient.put(`/products/${form.value._id}`, productData);
      const index = products.value.findIndex(p => p._id === form.value._id);
      if (index !== -1) {
        products.value.splice(index, 1, response.data);
      }
      toast.success('Đã cập nhật sản phẩm thành công!');
    } else { // Thêm mới
      const response = await apiClient.post('/products', productData);
      products.value.unshift(response.data);
      toast.success('Đã thêm sản phẩm thành công!');
    }
    closeDialog();
  } catch (err) {
    console.error('Lỗi lưu sản phẩm:', err);
    const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.';
    toast.error(errorMessage);
    if (err.response?.data?.errors) { // MongoDB validation errors
        let details = "Chi tiết lỗi: ";
        for (const key in err.response.data.errors) {
            details += `${err.response.data.errors[key].message} `;
        }
        toast.error(details, { timeout: 7000 });
    } else if (err.response?.data?.keyValue) { // MongoDB duplicate key error
        toast.error(`Lỗi trùng lặp: ${JSON.stringify(err.response.data.keyValue)} đã tồn tại.`, { timeout: 7000 });
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function confirmDeleteProduct(product) {
  if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không? Hành động này không thể hoàn tác.`)) {
    try {
      await apiClient.delete(`/products/${product._id}`);
      products.value = products.value.filter(p => p._id !== product._id);
      toast.success(`Đã xóa sản phẩm "${product.name}".`);
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
      toast.error(err.response?.data?.message || 'Không thể xóa sản phẩm.');
    }
  }
}

onMounted(() => {
  fetchProducts();
  const modalElement = productModalRef.value;
  if (modalElement) {
    productModalInstance = new Modal(modalElement);
    modalElement.addEventListener('hidden.bs.modal', () => {
       resetForm();
       isSubmitting.value = false;
    });
  }
});
</script>

<style scoped>
.table th {
    font-weight: 600;
    white-space: nowrap;
}
.table td {
    vertical-align: middle;
}
.modal-dialog {
    max-width: 750px; /* Có thể cần modal-xl nếu nhiều trường hơn nữa */
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>