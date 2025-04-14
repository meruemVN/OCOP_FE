<template>
    <div class="main-banner container-fluid bg-light p-5 mb-5 rounded">
      <div class="container">
        <h1 class="display-4 fw-bold text-success">Chào mừng đến OCOP Market</h1>
        <p class="col-md-8 fs-4">
          Khám phá các sản phẩm OCOP chất lượng cao từ khắp mọi miền đất nước.
        </p>
        <router-link to="/products" class="btn btn-primary btn-lg">
          Xem Sản phẩm
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  // No specific script logic needed for this simple static banner yet
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  .main-banner {
    /* Example: Add a background image */
    /* background: url('@/assets/banner-bg.jpg') no-repeat center center; */
    /* background-size: cover; */
  }
  </style>