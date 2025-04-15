<template>
    <div class="container py-4">
      <h2>Kênh người bán</h2>
      <p>Chào mừng <b>{{ userName }}</b> đến với kênh nhà phân phối!</p>
      <ul>
        <li>Quản lý thông tin nhà phân phối</li>
        <li>Thống kê đơn hàng</li>
        <li>Thống kê doanh số</li>
        <li>Thông báo từ hệ thống</li>
      </ul>
      <!-- Bổ sung các thành phần quản lý khác tùy ý -->
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  const store = useStore();
  const user = computed(() => store.getters['auth/currentUser']);
  const userName = computed(() => user.value?.name || '');
  </script>