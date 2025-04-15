<template>
  <footer class="footer-custom py-5">
    <div class="container">
      <div class="row g-4">
        <!-- Cột 1: Về OCOP Market -->
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Về OCOP Market</h5>
          <ul class="list-unstyled">
            <li><router-link to="/about">Giới thiệu</router-link></li>
            <li><router-link to="/terms">Điều khoản sử dụng</router-link></li>
            <li><router-link to="/privacy">Chính sách bảo mật</router-link></li>
          </ul>
        </div>
        <!-- Cột 2: Hỗ trợ khách hàng -->
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Hỗ trợ khách hàng</h5>
          <ul class="list-unstyled">
            <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li>
            <li><router-link to="/shipping">Chính sách vận chuyển</router-link></li>
            <li><router-link to="/returns">Chính sách đổi trả</router-link></li>
          </ul>
        </div>
        <!-- Cột 3: Đối tác -->
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Đối tác</h5>
          <ul class="list-unstyled">
            <li><router-link to="/become-seller">Trở thành người bán</router-link></li>
            <li><router-link to="/become-distributor">Trở thành nhà phân phối</router-link></li>
            <li><a href="#">Liên hệ hợp tác</a></li>
          </ul>
        </div>
        <!-- Cột 4: Liên hệ -->
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Liên hệ</h5>
          <p class="mb-2"><i class="fas fa-envelope me-2"></i>Email: <a href="mailto:support@ocopmarket.vn">support@ocopmarket.vn</a></p>
          <p class="mb-2"><i class="fas fa-phone-alt me-2"></i>Hotline: <a href="tel:19001234">1900 1234</a></p>
          <div class="d-flex gap-3 mt-3 footer-social-icons">
            <a href="#" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <!-- Đường kẻ ngang -->
      <hr class="my-4" />

      <!-- Phần dưới cùng -->
      <div class="footer-bottom pt-2 text-center">
        <small>
          © {{ currentYear }} OCOP Market. Tất cả các quyền đã được bảo vệ.
        </small>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer-custom {
  background: #222;
  color: #fff;
}
.footer-custom h5 {
  font-weight: bold;
  color: #53d397;
}
.footer-custom a {
  color: #b1f0d6;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-custom a:hover {
  color: #53d397;
  text-decoration: underline;
}
.footer-social-icons a {
  font-size: 1.3rem;
  color: #b1f0d6;
  transition: color 0.2s;
}
.footer-social-icons a:hover {
  color: #53d397;
}
.footer-bottom {
  color: #ccc;
  font-size: 0.95rem;
}
@media (max-width: 767px) {
  .footer-custom {
    text-align: center;
  }
  .footer-social-icons {
    justify-content: center !important;
  }
}
</style>