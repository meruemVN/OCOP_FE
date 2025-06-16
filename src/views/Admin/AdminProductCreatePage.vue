// src/views/admin/AdminProductCreatePage.vue
<template>
  <div class="container py-4">
    <h1>Admin - Thêm Sản phẩm Mới</h1>
    <p>Form để thêm sản phẩm mới sẽ được đặt ở đây.</p>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="productName" class="form-label">Tên sản phẩm</label>
        <input type="text" class="form-control" id="productName" v-model="product.name" required>
      </div>
      <div class="mb-3">
        <label for="productPrice" class="form-label">Giá</label>
        <input type="number" class="form-control" id="productPrice" v-model.number="product.price" required min="0">
      </div>
      <div class="mb-3">
        <label for="productDescription" class="form-label">Mô tả</label>
        <textarea class="form-control" id="productDescription" v-model="product.description" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="productCategory" class="form-label">Danh mục</label>
        <input type="text" class="form-control" id="productCategory" v-model="product.category">
      </div>
       <div class="mb-3">
        <label for="productCountInStock" class="form-label">Số lượng tồn kho</label>
        <input type="number" class="form-control" id="productCountInStock" v-model.number="product.countInStock" required min="0">
      </div>
      <!-- Thêm input cho hình ảnh nếu cần -->
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
         <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ isSubmitting ? 'Đang lưu...' : 'Tạo Sản Phẩm' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const store = useStore();
const router = useRouter();
const toast = useToast();

const product = reactive({
  name: '',
  price: 0,
  description: '',
  category: '', // Hoặc null nếu danh mục là object
  countInStock: 0,
  images: []
});
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Giả sử bạn có action 'admin/createProduct' trong store
    // await store.dispatch('admin/createProduct', product);
    toast.success('Sản phẩm đã được tạo thành công! (Giả lập)');
    // router.push({ name: 'AdminAllProducts' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi khi tạo sản phẩm.');
    console.error("Error creating product:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles specific to AdminProductCreatePage */
</style>