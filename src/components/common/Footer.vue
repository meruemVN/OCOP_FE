<template>
    <footer class="bg-green-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="font-bold text-lg mb-4">Về OCOP Market</h3>
            <ul class="space-y-2">
              <li><router-link to="/about" class="hover:text-green-200">Giới thiệu</router-link></li>
              <li><router-link to="/terms" class="hover:text-green-200">Điều khoản sử dụng</router-link></li>
              <li><router-link to="/privacy" class="hover:text-green-200">Chính sách bảo mật</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-bold text-lg mb-4">Hỗ trợ khách hàng</h3>
            <ul class="space-y-2">
              <li><router-link to="/faq" class="hover:text-green-200">Câu hỏi thường gặp</router-link></li>
              <li><router-link to="/shipping" class="hover:text-green-200">Chính sách vận chuyển</router-link></li>
              <li><router-link to="/returns" class="hover:text-green-200">Chính sách đổi trả</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-bold text-lg mb-4">Đối tác</h3>
            <ul class="space-y-2">
              <li><router-link to="/become-seller" class="hover:text-green-200">Trở thành người bán</router-link></li>
              <li><router-link to="/become-distributor" class="hover:text-green-200">Trở thành nhà phân phối</router-link></li>
              <li><a href="#" class="hover:text-green-200">Liên hệ hợp tác</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-bold text-lg mb-4">Liên hệ</h3>
            <p class="mb-2">Email: support@ocopmarket.vn</p>
            <p class="mb-2">Hotline: 1900 1234</p>
            <div class="flex space-x-4 mt-4">
              <a href="#" class="text-white hover:text-green-200"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="text-white hover:text-green-200"><i class="fab fa-instagram"></i></a>
              <a href="#" class="text-white hover:text-green-200"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-green-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} OCOP Market. Tất cả các quyền đã được bảo vệ.</p>
        </div>
      </div>
    </footer>
  </template>
  <script>
  export default {
    name: 'Footer',
  };
  </script>
  
  <style scoped>
  footer {
    background-color: #f8f9fa;
  }
  </style>