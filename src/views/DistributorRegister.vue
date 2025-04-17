<template>
  <div class="distributor-register container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
       <i class="fas fa-store me-2"></i>Đăng ký làm Nhà Phân Phối
    </h1>

    <div class="card shadow-sm border-light p-4 p-md-5 mx-auto" style="max-width: 700px;">
      <div class="card-body">
        <p class="text-muted text-center mb-4">
           Điền đầy đủ thông tin bên dưới để gửi yêu cầu đăng ký trở thành nhà phân phối OCOP.
        </p>

        <div v-if="formLoading" class="text-center py-5">
           <div class="spinner-border text-success" role="status">
              <span class="visually-hidden">Đang xử lý...</span>
           </div>
        </div>

         <!-- Form đăng ký -->
        <form v-else @submit.prevent="submitForm" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="businessName" class="form-label fw-medium">Tên doanh nghiệp/Hộ kinh doanh <span class="text-danger">*</span></label>
            <input
              type="text"
              id="businessName"
              v-model.trim="formData.companyName"
              class="form-control"
              required
              placeholder="Ví dụ: HTX Nông sản Sạch ABC"
            >
             <div class="invalid-feedback">Vui lòng nhập tên doanh nghiệp.</div>
          </div>

          <div class="mb-3">
            <label for="taxId" class="form-label fw-medium">Mã số thuế <span class="text-danger">*</span></label>
            <input
              type="text"
              id="taxId"
              v-model.trim="formData.taxId" 
              class="form-control"
              required
              placeholder="Nhập mã số thuế"
            >
            <div class="invalid-feedback">Vui lòng nhập mã số thuế.</div>
          </div>

          <div class="mb-3">
            <label for="businessLicense" class="form-label fw-medium">Mã số/Số ĐKKD/Giấy phép <span class="text-danger">*</span></label>
            <input
              type="text"
              id="businessLicense"
              v-model.trim="formData.businessLicense"
              class="form-control"
              required
              placeholder="Nhập mã số đăng ký kinh doanh hoặc số giấy phép liên quan"
            >
             <div class="invalid-feedback">Vui lòng nhập mã số giấy phép kinh doanh.</div>
          </div>

           <div class="mb-3">
            <label for="phone" class="form-label fw-medium">Số điện thoại liên hệ <span class="text-danger">*</span></label>
            <input
              type="tel"
              id="phone"
              v-model.trim="formData.phone" 
              class="form-control"
              required
              placeholder="Số điện thoại người đại diện hoặc công ty"
            >
             <div class="invalid-feedback">Vui lòng nhập số điện thoại.</div>
          </div>

           <div class="mb-3">
             <label for="address" class="form-label fw-medium">Địa chỉ trụ sở/kinh doanh <span class="text-danger">*</span></label>
             <input
               type="text"
               id="address"
               v-model.trim="formData.address" 
               class="form-control"
               required
               placeholder="Địa chỉ chi tiết"
             >
              <div class="invalid-feedback">Vui lòng nhập địa chỉ.</div>
           </div>


          <div class="mb-3">
            <label for="distributionArea" class="form-label fw-medium">Khu vực phân phối dự kiến <span class="text-danger">*</span></label>
            <select
              id="distributionArea"
              v-model="formData.distributionArea" 
              class="form-select"
              required
            >
              <option value="" disabled>-- Chọn khu vực --</option>
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
              <option value="Toàn quốc">Toàn quốc</option>
              <option value="Khu vực khác">Khu vực khác (ghi rõ)</option> <!-- Option khác -->
            </select>
             <div class="invalid-feedback">Vui lòng chọn khu vực phân phối.</div>
             <!-- Có thể thêm input text nếu chọn "Khu vực khác" -->
          </div>

          <div class="mb-4">
            <label for="description" class="form-label fw-medium">Mô tả về doanh nghiệp/kinh nghiệm (nếu có)</label>
            <textarea
              id="description"
              v-model.trim="formData.description" 
              rows="4"
              class="form-control"
              placeholder="Giới thiệu ngắn gọn về doanh nghiệp, kinh nghiệm phân phối, các sản phẩm OCOP đang quan tâm..."
            ></textarea>
          </div>

          <div class="alert alert-info small d-flex align-items-center" role="alert">
             <i class="fas fa-info-circle me-2 flex-shrink-0"></i>
             <div>
                Sau khi gửi đăng ký, chúng tôi sẽ xem xét thông tin và liên hệ lại với bạn trong thời gian sớm nhất để hoàn tất các thủ tục (nếu cần).
             </div>
          </div>

          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-success btn-lg"
              :disabled="formLoading"
            >
               <span v-if="formLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
               <i v-else class="fas fa-paper-plane me-2"></i>
              <span>{{ formLoading ? 'Đang gửi...' : 'Gửi Đăng Ký' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// Import icons nếu cần
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStore, faPaperPlane, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faStore, faPaperPlane, faInfoCircle);


export default {
  name: 'DistributorRegister',
  data() {
    return {
      // Sử dụng state loading/error của module distributor
      // loading: false, // Bỏ loading cục bộ
      formData: {
        companyName: '', // Đổi tên field cho khớp schema
        taxId: '',       // Thêm field
        businessLicense: '',
        distributionArea: '', // Đổi tên field
        phone: '',       // Thêm field
        address: '',     // Thêm field
        description: ''  // Thêm field
      }
    };
  },
  computed: {
    ...mapGetters({
      // Lấy state loading/error từ module distributor
      formLoading: 'distributor/isLoading',
      formError: 'distributor/distributorError',
      // Lấy thông tin user để có thể điền sẵn (nếu muốn)
      currentUser: 'auth/currentUser'
    })
  },
  methods: {
    ...mapActions({
      // Map action đăng ký từ module distributor
      registerDistributorAction: 'distributor/registerDistributor'
    }),

    async submitForm(event) {
      const form = event.target;
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }
      form.classList.add('was-validated'); // Hiển thị validation

      try {
        // Gọi action Vuex đã map
        const result = await this.registerDistributorAction(this.formData);

        // Xử lý kết quả thành công
        this.$toast.success(result.message || 'Đăng ký thành công! Chờ xét duyệt.'); // Hiển thị thông báo
        // Chuyển hướng về trang profile hoặc trang thông báo
        this.$router.push({ name: 'UserProfile' }); // Hoặc '/profile'

      } catch (error) {
        console.error('Distributor registration error:', error);
        // Lỗi đã được set trong state distributor/error, không cần alert
        // Component cha hoặc toast toàn cục có thể hiển thị lỗi này
         this.$toast.error(this.formError || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
      // Không cần finally loading ở đây vì state loading của store sẽ tự quản lý
    }
  },
  mounted() {
      // Có thể điền sẵn một số thông tin từ profile user nếu muốn
      if (this.currentUser) {
          this.formData.phone = this.currentUser.phone || '';
          // Điền các trường khác nếu có trong currentUser và hợp lý
      }
  }
};
</script>

<style scoped>
/* Thêm CSS nếu cần, ví dụ: */
.card {
  border: none; /* Bỏ border mặc định của card */
}
.form-label.fw-medium {
    font-weight: 500 !important; /* Đảm bảo fw-medium có tác dụng */
}
.needs-validation input:invalid,
.needs-validation select:invalid,
.needs-validation textarea:invalid {
    border-color: #dc3545; /* Màu đỏ cho input invalid của Bootstrap */
}
.was-validated input:invalid,
.was-validated select:invalid,
.was-validated textarea:invalid {
    border-color: #dc3545;
}
.was-validated input:invalid:focus,
.was-validated select:invalid:focus,
.was-validated textarea:invalid:focus {
   box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); /* Focus màu đỏ */
}
</style>