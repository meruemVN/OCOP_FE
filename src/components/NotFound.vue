<template>
    <div class="flex flex-col items-center justify-center py-12">
      <div class="text-9xl font-bold text-green-700 mb-4">404</div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Trang không tìm thấy</h1>
      <p class="text-lg text-gray-600 mb-8 text-center max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <router-link 
        to="/" 
        class="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-md font-medium"
      >
        Quay lại trang chủ
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>