<template>
  <div class="container py-4">
    <h1>Admin - Chỉnh Sửa Sản Phẩm</h1>
    <div v-if="loadingProduct" class="text-center">Đang tải thông tin sản phẩm...</div>
    <div v-else-if="!product" class="alert alert-warning">Không tìm thấy sản phẩm.</div>
    <form v-else @submit.prevent="handleSubmit">
       <p>Chỉnh sửa thông tin cho sản phẩm: <strong>{{ productInitialData.name }}</strong> (ID: {{ productId }})</p>
      <div class="mb-3">
        <label for="productName" class="form-label">Tên sản phẩm</label>
        <input type="text" class="form-control" id="productName" v-model="productData.name" required>
      </div>
      <div class="mb-3">
        <label for="productPrice" class="form-label">Giá</label>
        <input type="number" class="form-control" id="productPrice" v-model.number="productData.price" required min="0">
      </div>
      <div class="mb-3">
        <label for="productDescription" class="form-label">Mô tả</label>
        <textarea class="form-control" id="productDescription" v-model="productData.description" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="productCategory" class="form-label">Danh mục</label>
        <input type="text" class="form-control" id="productCategory" v-model="productData.category">
         <!-- Hoặc dropdown nếu bạn có danh sách danh mục -->
      </div>
       <div class="mb-3">
        <label for="productCountInStock" class="form-label">Số lượng tồn kho</label>
        <input type="number" class="form-control" id="productCountInStock" v-model.number="productData.countInStock" required min="0">
      </div>
      <!-- Thêm input cho hình ảnh nếu cần -->
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const store = useStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const productId = ref(route.params.id);
const product = ref(null); // Dữ liệu sản phẩm fetch từ API
const productInitialData = reactive({ name: ''}); // Để hiển thị tên ban đầu
const productData = reactive({
  name: '',
  price: 0,
  description: '',
  category: '',
  countInStock: 0,
  images: []
});
const loadingProduct = ref(true);
const isSubmitting = ref(false);

onMounted(async () => {
  loadingProduct.value = true;
  try {
    // Giả sử có action 'admin/fetchProductById'
    // const fetchedProduct = await store.dispatch('admin/fetchProductById', productId.value);
     // Giả lập fetch product
    await new Promise(resolve => setTimeout(resolve, 500));
    const fetchedProduct = { _id: productId.value, name: `Product ${productId.value.slice(-3)}`, price: 100000, description: 'Mô tả mẫu', category: 'Danh mục A', countInStock: 10 }; // Dữ liệu giả

    if (fetchedProduct) {
      product.value = fetchedProduct;
      Object.assign(productInitialData, fetchedProduct);
      Object.assign(productData, fetchedProduct);
    } else {
      toast.error('Không tìm thấy sản phẩm.');
      // router.push({ name: 'AdminAllProducts' });
    }
  } catch (error) {
    toast.error('Lỗi khi tải thông tin sản phẩm.');
    console.error("Error fetching product for edit:", error);
  } finally {
    loadingProduct.value = false;
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Giả sử có action 'admin/updateProduct'
    // await store.dispatch('admin/updateProduct', { productId: productId.value, productData });
    toast.success('Thông tin sản phẩm đã được cập nhật! (Giả lập)');
    // router.push({ name: 'AdminAllProducts' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi khi cập nhật sản phẩm.');
    console.error("Error updating product:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles specific to AdminProductEditPage */
</style>