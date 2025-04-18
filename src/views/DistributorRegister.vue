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
              <!-- Lặp qua mảng provinces từ data() -->
              <option v-for="province in provinces" :key="province" :value="province">
                {{ province }}
              </option>
            </select>
            <div class="invalid-feedback">Vui lòng chọn khu vực phân phối.</div>
            <!-- Thêm input cho "Khu vực khác" nếu cần -->
            <input
                v-if="formData.distributionArea === 'Khu vực khác'"
                type="text"
                class="form-control mt-2"
                placeholder="Vui lòng ghi rõ khu vực khác"
                v-model="formData.otherDistributionArea" 
                required 
              >
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStore, faPaperPlane, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faStore, faPaperPlane, faInfoCircle);

// Danh sách 63 tỉnh thành + Toàn quốc + Khác
const ALL_PROVINCES_AND_OPTIONS = [
  "Toàn quốc", // Thêm tùy chọn Toàn quốc lên đầu
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
  "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
  "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội",
  "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
  "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
  "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
  "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
  "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh",
  "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
  "Khu vực khác" // Thêm tùy chọn Khác ở cuối
];

export default {
  name: 'DistributorRegister',
  data() {
    return {
      provinces: ALL_PROVINCES_AND_OPTIONS, // Sử dụng danh sách đầy đủ
      formData: {
        companyName: '',
        taxId: '',
        businessLicense: '',
        // Thay vì chỉ là String, nếu bạn muốn cho phép chọn NHIỀU khu vực,
        // bạn cần đổi kiểu dữ liệu này thành Array và dùng multiple select
        // Nhưng theo schema và API hiện tại, nó là String, nên giữ nguyên là String
        distributionArea: '', // Khởi tạo rỗng để placeholder "-- Chọn khu vực --" hiển thị
        phone: '',
        address: '',
        description: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      formLoading: 'distributor/isLoading',
      formError: 'distributor/distributorError',
      currentUser: 'auth/currentUser'
    })
  },
  methods: {
    ...mapActions({
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
      form.classList.add('was-validated');

      // Kiểm tra nếu chọn "Khu vực khác" thì cần xử lý thêm (ví dụ: yêu cầu nhập vào ô khác)
      if (this.formData.distributionArea === 'Khu vực khác') {
          // Bạn cần thêm một input field khác để người dùng nhập khu vực cụ thể
          // và gán giá trị đó vào formData trước khi gửi đi, hoặc báo lỗi nếu chưa nhập.
          alert('Vui lòng liên hệ để đăng ký khu vực khác.'); // Ví dụ đơn giản
          return; // Ngăn submit
      }


      try {
        const result = await this.registerDistributorAction(this.formData);
        this.$toast.success(result.message || 'Đăng ký thành công! Chờ xét duyệt.');
        this.$router.push({ name: 'UserProfile' });
      } catch (error) {
        console.error('Distributor registration error:', error);
        this.$toast.error(this.formError || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  },
  mounted() {
      if (this.currentUser) {
          this.formData.phone = this.currentUser.phone || '';
      }
  }
};
</script>

<style scoped>
/* CSS giữ nguyên như trước */
.card { border: none; }
.form-label.fw-medium { font-weight: 500 !important; }
.needs-validation input:invalid,
.needs-validation select:invalid,
.needs-validation textarea:invalid { border-color: #dc3545; }
.was-validated input:invalid,
.was-validated select:invalid,
.was-validated textarea:invalid { border-color: #dc3545; }
.was-validated input:invalid:focus,
.was-validated select:invalid:focus,
.was-validated textarea:invalid:focus { box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); }
</style>