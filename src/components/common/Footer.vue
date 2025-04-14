<template>
  <footer class="footer-custom py-5"> {/* Use custom class and Bootstrap padding */}
    <div class="container">
      <div class="row g-4"> {/* Use Bootstrap grid row with gutters (spacing) */}

        {/* Column 1: Về OCOP Market */}
        <div class="col-12 col-md-6 col-lg-3"> {/* Responsive columns */}
          <h5>Về OCOP Market</h5> {/* Use h5 for headings */}
          <ul>
            <li><router-link to="/about">Giới thiệu</router-link></li>
            <li><router-link to="/terms">Điều khoản sử dụng</router-link></li>
            <li><router-link to="/privacy">Chính sách bảo mật</router-link></li>
          </ul>
        </div>

        {/* Column 2: Hỗ trợ khách hàng */}
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Hỗ trợ khách hàng</h5>
          <ul>
            <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li>
            <li><router-link to="/shipping">Chính sách vận chuyển</router-link></li>
            <li><router-link to="/returns">Chính sách đổi trả</router-link></li>
          </ul>
        </div>

        {/* Column 3: Đối tác */}
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Đối tác</h5>
          <ul>
            <li><router-link to="/become-seller">Trở thành người bán</router-link></li>
            <li><router-link to="/become-distributor">Trở thành nhà phân phối</router-link></li>
            <li><a href="#">Liên hệ hợp tác</a></li>
          </ul>
        </div>

        {/* Column 4: Liên hệ */}
        <div class="col-12 col-md-6 col-lg-3">
          <h5>Liên hệ</h5>
          <p class="mb-2">Email: support@ocopmarket.vn</p>
          <p class="mb-2">Hotline: 1900 1234</p>
          <div class="d-flex gap-3 mt-3 footer-social-icons"> {/* Flexbox with gap for spacing */}
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
          </div>
        </div>

      </div> {/* End .row */}

      {/* Bottom Section */}
      {/* Use standard HTML comments for clarity within the template */}
      <!-- Custom class for border, Bootstrap margins/padding -->
      <div class="footer-bottom mt-5 pt-4 text-center">
        <!-- Use <small> tag for semantic meaning and default styling -->
        <small>© {{ new Date().getFullYear() }} OCOP Market. Tất cả các quyền đã được bảo vệ.</small>
      </div> {/* <<< THIS is the closing tag for footer-bottom */}

      </div> {/* End .container */}
    </footer>
</template>

<script>
export default {
name: 'Footer',
};
</script>

<style>
/* Styles are in src/assets/css/footer.css */
/* Keep this block empty or remove it */
</style>