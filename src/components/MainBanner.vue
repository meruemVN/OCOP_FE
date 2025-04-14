<template>
    <section class="banner relative">
      <div class="banner-image h-[500px] bg-cover bg-center relative" 
        style="background-image: url('@/assets/logo.png')">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        <div class="container mx-auto px-4 h-full flex items-center relative z-10">
          <div class="text-white max-w-xl">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Sản phẩm OCOP Việt Nam</h1>
            <p class="text-xl mb-8">Khám phá các sản phẩm chất lượng từ chương trình "Mỗi xã một sản phẩm" trên khắp Việt Nam</p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/products" class="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition">
                Khám phá ngay
              </router-link>
              <button class="bg-white hover:bg-gray-100 text-green-800 py-3 px-6 rounded-lg font-medium transition">
                Tìm hiểu về OCOP
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Thông tin nổi bật -->
      <div class="container mx-auto px-4 -mt-16 relative z-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Sản phẩm Chất lượng</h3>
              <p class="text-gray-600">Đạt tiêu chuẩn OCOP 3-5 sao</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Nguồn gốc Rõ ràng</h3>
              <p class="text-gray-600">Truy xuất nguồn gốc minh bạch</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-lg">Hỗ trợ Cộng đồng</h3>
              <p class="text-gray-600">Phát triển kinh tế địa phương</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'MainBanner'
  }
  </script>