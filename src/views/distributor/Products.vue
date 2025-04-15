<template>
    <div class="container py-4">
      <h2>Quản lý sản phẩm</h2>
      <p>Thêm, sửa, xóa và cập nhật sản phẩm bạn phân phối.</p>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Đã bán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price.toLocaleString() }}₫</td>
            <td>{{ product.countInStock }}</td>
            <td>{{ product.sold }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="editProduct(product)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(product)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="addProduct">Thêm sản phẩm</button>
  
      <!-- Modal thêm/sửa sản phẩm -->
      <dialog ref="productDialog">
        <form @submit.prevent="submitProduct">
            <h5 v-if="!form._id">Thêm sản phẩm</h5>
            <h5 v-else>Cập nhật sản phẩm</h5>
            <div class="mb-2">
            <label class="form-label">Tên sản phẩm:</label>
            <input v-model="form.name" required class="form-control" />
            </div>
            <div class="mb-2">
            <label class="form-label">Danh mục:</label>
            <input v-model="form.category" required class="form-control" />
            </div>
            <div class="mb-2">
            <label class="form-label">Mô tả:</label>
            <textarea v-model="form.description" required class="form-control"></textarea>
            </div>
            <div class="mb-2">
            <label class="form-label">Giá:</label>
            <input v-model.number="form.price" type="number" min="0" required class="form-control" />
            </div>
            <div class="mb-2">
            <label class="form-label">Tồn kho:</label>
            <input v-model.number="form.countInStock" type="number" min="0" required class="form-control" />
            </div>
            <div class="mb-2">
            <label class="form-label">Đã bán:</label>
            <input v-model.number="form.sold" type="number" min="0" required class="form-control" />
            </div>
            <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="closeDialog">Hủy</button>
            <button type="submit" class="btn btn-primary">{{ form._id ? 'Cập nhật' : 'Thêm mới' }}</button>
            </div>
        </form>
      </dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/services/api';
  
  const products = ref([]);
  const productDialog = ref(null);
  const form = ref({
    _id: null,
    name: '',
    category: '',
    price: 0,
    countInStock: 0,
    sold: 0,
  });
  const isSubmitting = ref(false);
  
  async function fetchProducts() {
    try {
      const res = await api.get('/products/my-products');
      products.value = res;
    } catch (err) {
      alert('Lỗi tải sản phẩm');
      console.error(err);
    }
  }
  onMounted(fetchProducts);
  
  function resetForm() {
    form.value = {
      _id: null,
      name: '',
      category: '',
      price: 0,
      countInStock: 0,
      sold: 0,
    };
  }
  
  function addProduct() {
    resetForm();
    productDialog.value.showModal();
  }
  
  function editProduct(product) {
    form.value = { ...product }; // spread để tránh liên kết tham chiếu
    productDialog.value.showModal();
  }
  
  function closeDialog() {
    productDialog.value.close();
    isSubmitting.value = false;
  }
  
  async function submitProduct() {
    isSubmitting.value = true;
    try {
      // Nếu có _id => update, không có => create
      if (form.value._id) {
        // Sửa sản phẩm
        await api.put(`/products/${form.value._id}`, form.value);
        alert('Đã cập nhật sản phẩm thành công!');
      } else {
        // Thêm sản phẩm
        await api.post('/products', form.value);
        alert('Đã thêm sản phẩm thành công!');
      }
      closeDialog();
      await fetchProducts();
    } catch (err) {
      alert('Có lỗi khi lưu sản phẩm');
      console.error(err);
    } finally {
      isSubmitting.value = false;
    }
  }
  
  async function deleteProduct(product) {
    if (confirm(`Bạn chắc chắn muốn xóa ${product.name}?`)) {
      try {
        await api.delete(`/products/${product._id}`);
        await fetchProducts();
      } catch (err) {
        alert('Không thể xóa sản phẩm');
      }
    }
  }
  </script>
  
  <style scoped>
  dialog {
    border: none;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    padding: 0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  }
  dialog::backdrop {
    background: rgba(0,0,0,0.2);
  }
  form {
    padding: 24px 16px 16px 16px;
  }
  </style>