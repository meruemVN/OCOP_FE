<template>
  <div class="container py-4">
    <h1>Admin - Tạo Người Dùng Mới</h1>
    <p>Form để thêm người dùng mới vào hệ thống.</p>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="userName" class="form-label">Tên người dùng</label>
        <input type="text" class="form-control" id="userName" v-model="userData.name" required>
      </div>
      <div class="mb-3">
        <label for="userEmail" class="form-label">Email</label>
        <input type="email" class="form-control" id="userEmail" v-model="userData.email" required>
      </div>
      <div class="mb-3">
        <label for="userPassword" class="form-label">Mật khẩu</label>
        <input type="password" class="form-control" id="userPassword" v-model="userData.password" required>
      </div>
      <div class="mb-3">
        <label for="userRole" class="form-label">Vai trò</label>
        <select class="form-select" id="userRole" v-model="userData.role">
          <option value="user">User</option>
          <option value="distributor">Distributor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ isSubmitting ? 'Đang lưu...' : 'Tạo Người Dùng' }}
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

const userData = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Giả sử có action 'admin/createUser' trong store
    // await store.dispatch('admin/createUser', userData);
    toast.success('Người dùng đã được tạo thành công! (Giả lập)');
    // router.push({ name: 'AdminUserList' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi khi tạo người dùng.');
    console.error("Error creating user:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles specific to AdminUserCreatePage */
</style>