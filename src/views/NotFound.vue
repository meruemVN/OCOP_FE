<!-- src/views/NotFound.vue -->
<template>
    <div class="not-found py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="mb-8">
          <h1 class="text-8xl font-bold text-green-600">404</h1>
          <h2 class="text-3xl font-semibold mt-4 mb-2">Trang không tồn tại</h2>
          <p class="text-gray-600 max-w-md mx-auto">
            Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          </p>
        </div>
        
        <div class="mb-10">
          <img 
            src="@/assets/logo.png" 
            alt="OCOP Store" 
            class="max-w-xs mx-auto opacity-50"
          >
        </div>
        
        <div>
          <router-link 
            to="/" 
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition inline-block"
          >
            Trở về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>