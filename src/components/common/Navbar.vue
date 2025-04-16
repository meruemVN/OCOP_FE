<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <slot name="brand">MyApp</slot>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" exact-active-class="active">
              Trang chủ
            </router-link>
          </li>

          <!-- Menu cho user thường -->
          <template v-if="isLoggedIn && userRole === 'user'">
            <li class="nav-item">
              <router-link to="/register-distributor" class="nav-link" active-class="active">
                Đăng ký làm nhà phân phối
              </router-link>
            </li>
          </template>

          <!-- Menu cho distributor -->
          <template v-if="isLoggedIn && userRole === 'distributor'">
            <li class="nav-item">
              <router-link to="/distributor/channel" class="nav-link" active-class="active">
                Kênh người bán
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/distributor/products" class="nav-link" active-class="active">
                Quản lý sản phẩm
              </router-link>
            </li>
          </template>

          <!-- Menu cho admin -->
          <template v-if="isLoggedIn && userRole === 'admin'">
            <li class="nav-item">
              <router-link to="/admin/dashboard" class="nav-link" active-class="active">
                Dashboard
              </router-link>
            </li>
          </template>
        </ul>

        <!-- RIGHT: Cart icon + User Auth -->
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <!-- Giỏ hàng -->
          <li class="nav-item me-2">
            <router-link to="/cart" class="nav-link position-relative" aria-label="Giỏ hàng">
              <font-awesome-icon :icon="['fas', 'shopping-cart']" size="lg" />
              <span
                v-if="cartCount > 0"
                class="cart-badge position-absolute translate-middle badge rounded-pill bg-success"
                style="top: 6px; left: 22px; font-size: 0.83em;"
              >{{ cartCount }}</span>
            </router-link>
          </li>

          <!-- Auth Buttons / User Dropdown -->
          <template v-if="!isLoggedIn">
            <li class="nav-item me-2">
              <router-link to="/login" class="btn btn-outline-success me-2">
                Đăng nhập
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-success">
                Đăng ký
              </router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                 role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <font-awesome-icon :icon="['fas', 'user']" /> {{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">Hồ sơ</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/settings">Cài đặt</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/orders">Đơn mua</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="me-1"/> Đăng xuất
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
const currentUser = computed(() => store.getters['auth/currentUser']);
const userName = computed(() => currentUser.value?.name || 'Tài khoản');
const userRole = computed(() => currentUser.value?.role || '');
const cartCount = computed(() => store.getters['cart/cartItemCount'] || 0);

const logout = () => {
  store.dispatch('auth/logout');
  router.push('/');
};
</script>

<style scoped>
.nav-link.active {
  font-weight: bold;
  color: #33cc99 !important;
}
.btn {
  min-width: 100px;
}
.cart-badge {
  pointer-events: none;
  z-index: 2;
}
</style>