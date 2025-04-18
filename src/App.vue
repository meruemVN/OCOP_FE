<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Sử dụng tên Header thay vì Navbar nếu component tên là Header -->
    <Header />
    <main class="flex-grow-1 container py-4"> 
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" /> 
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/common/Navbar.vue'; // Đảm bảo tên và đường dẫn đúng
import Footer from '@/components/common/Footer.vue';
import { mapActions, mapGetters } from 'vuex'; // Import mapActions, mapGetters nếu cần

export default {
  name: 'App',
  components: {
    Header, // Sử dụng tên đã import
    Footer,
  },
  computed: {
      // Có thể map getter isLoggedIn ở đây nếu cần kiểm tra trước khi gọi action
      ...mapGetters({
          isUserLoggedIn: 'auth/isLoggedIn' // Map getter từ auth module
      })
  },
  methods: {
      ...mapActions({
          initializeCartAction: 'cart/initializeCart', // Map action từ cart module
          // Có thể map thêm action kiểm tra auto-login nếu có
          // tryAutoLoginAction: 'auth/tryAutoLogin'
      })
  },
  created() {
    // Hook created() chạy trước khi component được mount vào DOM
    console.log("App.vue created hook");

    // >> GỌI ACTION KHỞI TẠO GIỎ HÀNG TẠI ĐÂY <<
    // Action này sẽ kiểm tra trạng thái login bên trong nó
    // và quyết định lấy cart từ API hay chỉ dùng localStorage
    this.initializeCartAction();

    // Nếu bạn có cơ chế auto-login (kiểm tra token trong localStorage),
    // bạn có thể gọi nó ở đây hoặc trước initializeCartAction:
    // this.tryAutoLoginAction();

    // Quan trọng: Logic khởi tạo state từ localStorage (trong định nghĩa state của các module)
    // đã chạy ngay khi store được tạo, trước cả hook created này.
    // initializeCart chủ yếu để fetch dữ liệu từ API nếu đã login.
  }
};
</script>

<style>
/* Global styles hoặc import file CSS chính */
/* Ví dụ: @import './assets/css/main.css'; */

body {
    background-color: #f8f9fa; /* Màu nền nhẹ cho body */
}

.container {
    max-width: 1200px; /* Giới hạn chiều rộng tối đa của container */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease; /* Sửa lại transition time */
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>