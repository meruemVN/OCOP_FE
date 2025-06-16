<template>
  <div class="container py-4">
    <h1>Admin - Chỉnh Sửa Người Dùng</h1>
    <div v-if="loadingUser" class="text-center">Đang tải thông tin người dùng...</div>
    <div v-else-if="!user" class="alert alert-warning">Không tìm thấy người dùng.</div>
    <form v-else @submit.prevent="handleSubmit">
      <p>Chỉnh sửa thông tin cho người dùng: <strong>{{ userInitialData.name }}</strong> (ID: {{ userId }})</p>
      <div class="mb-3">
        <label for="userName" class="form-label">Tên người dùng</label>
        <input type="text" class="form-control" id="userName" v-model="userData.name" required>
      </div>
      <div class="mb-3">
        <label for="userEmail" class="form-label">Email</label>
        <input type="email" class="form-control" id="userEmail" v-model="userData.email" required>
      </div>
      <div class="mb-3">
        <label for="userRole" class="form-label">Vai trò</label>
        <select class="form-select" id="userRole" v-model="userData.role">
          <option value="user">User</option>
          <option value="distributor">Distributor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="userIsActive" v-model="userData.isActive">
        <label class="form-check-label" for="userIsActive">Hoạt động</label>
      </div>
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

const userId = ref(route.params.id);
const user = ref(null); // Dữ liệu người dùng fetch từ API
const userInitialData = reactive({ name: '', email: '', role: 'user', isActive: true }); // Để hiển thị tên ban đầu
const userData = reactive({ name: '', email: '', role: 'user', isActive: true }); // Để binding với form
const loadingUser = ref(true);
const isSubmitting = ref(false);

onMounted(async () => {
  loadingUser.value = true;
  try {
    // Giả sử có action 'admin/fetchUserById'
    // const fetchedUser = await store.dispatch('admin/fetchUserById', userId.value);
    // Giả lập fetch user
    await new Promise(resolve => setTimeout(resolve, 500));
    const fetchedUser = { _id: userId.value, name: `User ${userId.value.slice(-3)}`, email: `user${userId.value.slice(-3)}@example.com`, role: 'user', isActive: true }; // Dữ liệu giả

    if (fetchedUser) {
      user.value = fetchedUser;
      Object.assign(userInitialData, fetchedUser); // Sao chép để hiển thị tên ban đầu
      Object.assign(userData, fetchedUser);       // Sao chép vào form data
    } else {
      toast.error('Không tìm thấy người dùng.');
      // router.push({ name: 'AdminUserList' });
    }
  } catch (error) {
    toast.error('Lỗi khi tải thông tin người dùng.');
    console.error("Error fetching user for edit:", error);
  } finally {
    loadingUser.value = false;
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Giả sử có action 'admin/updateUser'
    // await store.dispatch('admin/updateUser', { userId: userId.value, userData });
    toast.success('Thông tin người dùng đã được cập nhật! (Giả lập)');
    // router.push({ name: 'AdminUserList' });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Lỗi khi cập nhật người dùng.');
    console.error("Error updating user:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Styles specific to AdminUserEditPage */
</style>