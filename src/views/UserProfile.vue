<template>
  <div class="user-profile container my-5">
    <h1 class="text-center text-success mb-4 h2 fw-bold">
      <i class="fas fa-user-circle me-2"></i>Tài khoản của tôi
    </h1>

    <div class="row g-4">
      <!-- Sidebar Navigation -->
      <div class="col-md-3">
        <div class="card shadow-sm border-light overflow-hidden">
          <div class="card-header bg-success-subtle text-success-emphasis p-3">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div
                  class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-semibold"
                  style="width: 45px; height: 45px; font-size: 1.1rem;"
                >
                  {{ userInitials }}
                </div>
              </div>
              <div class="overflow-hidden">
                <h6 class="card-title mb-0 text-dark text-truncate fw-medium">{{ user.name }}</h6>
                <small class="text-muted text-truncate d-block">{{ user.email }}</small>
              </div>
            </div>
          </div>
          <div class="list-group list-group-flush">
            <a
              href="#profile"
              @click.prevent="activeTab = 'profile'"
              class="list-group-item list-group-item-action d-flex align-items-center"
              :class="{ 'active text-white bg-success border-success': activeTab === 'profile' }"
            >
              <i class="fas fa-user fa-fw me-2 text-secondary" :class="{'text-white': activeTab === 'profile'}"></i> Thông tin tài khoản
            </a>
             <router-link
                to="/orders"
                class="list-group-item list-group-item-action d-flex align-items-center"
             >
                <i class="fas fa-receipt fa-fw me-2 text-secondary"></i> Đơn hàng của tôi
             </router-link>
             <a
                href="#addresses"
                @click.prevent="activeTab = 'addresses'"
                class="list-group-item list-group-item-action d-flex align-items-center"
                :class="{ 'active text-white bg-success border-success': activeTab === 'addresses' }"
             >
                <i class="fas fa-map-marker-alt fa-fw me-2 text-secondary" :class="{'text-white': activeTab === 'addresses'}"></i> Sổ địa chỉ
             </a>
             <a
                href="#password"
                @click.prevent="activeTab = 'password'"
                class="list-group-item list-group-item-action d-flex align-items-center"
                :class="{ 'active text-white bg-success border-success': activeTab === 'password' }"
             >
                <i class="fas fa-lock fa-fw me-2 text-secondary" :class="{'text-white': activeTab === 'password'}"></i> Đổi mật khẩu
             </a>
             <a
                href="#notifications"
                @click.prevent="activeTab = 'notifications'"
                class="list-group-item list-group-item-action d-flex align-items-center"
                :class="{ 'active text-white bg-success border-success': activeTab === 'notifications' }"
             >
                <i class="fas fa-bell fa-fw me-2 text-secondary" :class="{'text-white': activeTab === 'notifications'}"></i> Thông báo
             </a>
             <a
                v-if="user.role === 'user'"
                href="#seller"
                @click.prevent="activeTab = 'seller'"
                class="list-group-item list-group-item-action d-flex align-items-center"
                :class="{ 'active text-white bg-success border-success': activeTab === 'seller' }"
             >
                <i class="fas fa-store fa-fw me-2 text-secondary" :class="{'text-white': activeTab === 'seller'}"></i> Đăng ký bán hàng
             </a>
             <router-link
                v-if="user.role === 'distributor'"
                to="/distributor/channel"
                class="list-group-item list-group-item-action d-flex align-items-center"
             >
                <i class="fas fa-store-alt fa-fw me-2 text-secondary"></i> Kênh người bán
             </router-link>
             <router-link
                v-if="user.role === 'admin'"
                to="/admin"
                class="list-group-item list-group-item-action d-flex align-items-center"
             >
                <i class="fas fa-cog fa-fw me-2 text-secondary"></i> Quản trị hệ thống
             </router-link>
             <a
                href="#"
                @click.prevent="logout"
                class="list-group-item list-group-item-action d-flex align-items-center text-danger"
             >
                <i class="fas fa-sign-out-alt fa-fw me-2"></i> Đăng xuất
             </a>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="col-md-9">
        <div class="card shadow-sm border-light">
          <div class="card-body p-4">
            <!-- Profile Tab Content -->
            <div v-if="activeTab === 'profile'">
              <h4 class="card-title mb-4 text-success fw-semibold">Thông tin cá nhân</h4>
              <form @submit.prevent="updateUserProfile" class="needs-validation" novalidate>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label for="profileName" class="form-label">Họ và tên</label>
                    <input
                      id="profileName"
                      v-model="profileData.name"
                      type="text"
                      class="form-control"
                      required
                    >
                     <div class="invalid-feedback">Vui lòng nhập họ tên.</div>
                  </div>
                  <div class="col-md-6">
                    <label for="profileEmail" class="form-label">Email</label>
                    <input
                      id="profileEmail"
                      v-model="profileData.email"
                      type="email"
                      class="form-control"
                      disabled
                      readonly
                      style="background-color: #e9ecef;"
                    >
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label for="profilePhone" class="form-label">Số điện thoại</label>
                    <input
                      id="profilePhone"
                      v-model="profileData.phone"
                      type="tel"
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-6">
                    <label for="profileBirthdate" class="form-label">Ngày sinh</label>
                    <input
                      id="profileBirthdate"
                      v-model="profileData.birthdate"
                      type="date"
                      class="form-control"
                    >
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label d-block mb-2">Giới tính</label>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="gender-male" value="male" v-model="profileData.gender">
                    <label class="form-check-label" for="gender-male">Nam</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="gender-female" value="female" v-model="profileData.gender">
                    <label class="form-check-label" for="gender-female">Nữ</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="gender-other" value="other" v-model="profileData.gender">
                    <label class="form-check-label" for="gender-other">Khác</label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    class="btn btn-success px-4"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="fas fa-save me-2"></i>
                    <span>{{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Addresses Tab Content -->
            <div v-else-if="activeTab === 'addresses'">
               <div class="d-flex justify-content-between align-items-center mb-4">
                   <h4 class="card-title text-success fw-semibold mb-0">Sổ địa chỉ</h4>
                    <button
                        @click="openAddAddressModal"
                        class="btn btn-sm btn-success"
                    >
                        <i class="fas fa-plus me-1"></i> Thêm địa chỉ mới
                    </button>
               </div>

               <div v-if="!addresses || addresses.length === 0" class="text-center py-5 text-muted">
                   <i class="fas fa-map-marked-alt fa-3x mb-3"></i>
                   <p>Bạn chưa có địa chỉ nào được lưu.</p>
               </div>

               <div v-else class="list-group">
                   <div
                    v-for="(address, index) in addresses"
                    :key="index"
                    class="list-group-item list-group-item-action flex-column align-items-start mb-3 border rounded shadow-sm"
                   >
                     <div class="d-flex w-100 justify-content-between mb-2">
                       <div>
                          <h6 class="mb-1 fw-semibold">
                            {{ address.fullName }}
                             <span v-if="address.isDefault" class="badge bg-success ms-2">Mặc định</span>
                          </h6>
                          <small class="text-muted">{{ address.phone }}</small>
                       </div>
                        <div class="btn-group btn-group-sm">
                             <button @click="openEditAddressModal(index)" class="btn btn-outline-primary">
                                <i class="fas fa-edit"></i>
                             </button>
                             <button @click="deleteAddress(index)" class="btn btn-outline-danger">
                                 <i class="fas fa-trash"></i>
                             </button>
                        </div>
                     </div>
                     <p class="mb-1">
                       {{ address.addressDetail }}, {{ address.ward }}, {{ address.district }}, {{ address.province }}
                     </p>
                     <button
                       v-if="!address.isDefault"
                       @click="setDefaultAddress(index)"
                       class="btn btn-link p-0 text-decoration-none text-success mt-1"
                       style="font-size: 0.9em;"
                     >
                       Đặt làm mặc định
                     </button>
                   </div>
               </div>

                <!-- Address Modal (Using Bootstrap Modal) -->
                <div class="modal fade" id="addressModal" tabindex="-1" aria-labelledby="addressModalLabel" aria-hidden="true" ref="addressModalRef">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="addressModalLabel">
                           {{ editingAddressIndex === null ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ' }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="saveAddress" class="needs-validation" novalidate>
                           <div class="row g-3 mb-3">
                             <div class="col-md-6">
                               <label for="modalFullName" class="form-label">Họ và tên</label>
                               <input id="modalFullName" v-model="addressForm.fullName" type="text" class="form-control" required>
                               <div class="invalid-feedback">Vui lòng nhập họ tên.</div>
                             </div>
                             <div class="col-md-6">
                               <label for="modalPhone" class="form-label">Số điện thoại</label>
                               <input id="modalPhone" v-model="addressForm.phone" type="tel" class="form-control" required>
                               <div class="invalid-feedback">Vui lòng nhập số điện thoại.</div>
                             </div>
                           </div>

                           <div class="row g-3 mb-3">
                              <div class="col-md-4">
                                <label for="modalProvince" class="form-label">Tỉnh/Thành phố</label>
                                <select id="modalProvince" v-model="addressForm.province" class="form-select" required>
                                   <option value="" disabled>Chọn...</option>
                                   <option value="Hà Nội">Hà Nội</option>
                                   <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                   <option value="Đà Nẵng">Đà Nẵng</option>
                                   {/* More options */}
                                </select>
                                <div class="invalid-feedback">Vui lòng chọn Tỉnh/Thành phố.</div>
                              </div>
                               <div class="col-md-4">
                                 <label for="modalDistrict" class="form-label">Quận/Huyện</label>
                                 <select id="modalDistrict" v-model="addressForm.district" class="form-select" required>
                                   <option value="" disabled>Chọn...</option>
                                   {/* Dynamic options based on province */}
                                   <option value="Quận 1">Quận 1 (HCM)</option>
                                    <option value="Ba Đình">Ba Đình (HN)</option>
                                 </select>
                                 <div class="invalid-feedback">Vui lòng chọn Quận/Huyện.</div>
                               </div>
                               <div class="col-md-4">
                                 <label for="modalWard" class="form-label">Phường/Xã</label>
                                 <select id="modalWard" v-model="addressForm.ward" class="form-select" required>
                                     <option value="" disabled>Chọn...</option>
                                     {/* Dynamic options based on district */}
                                     <option value="Phường Bến Nghé">P. Bến Nghé (Q1)</option>
                                      <option value="Phường Điện Biên">P. Điện Biên (Ba Đình)</option>
                                 </select>
                                 <div class="invalid-feedback">Vui lòng chọn Phường/Xã.</div>
                               </div>
                           </div>

                            <div class="mb-3">
                               <label for="modalAddressDetail" class="form-label">Địa chỉ chi tiết</label>
                               <input id="modalAddressDetail" v-model="addressForm.addressDetail" type="text" class="form-control" required placeholder="Số nhà, tên đường...">
                               <div class="invalid-feedback">Vui lòng nhập địa chỉ chi tiết.</div>
                           </div>

                           <div class="form-check mb-3">
                              <input class="form-check-input" type="checkbox" id="modalDefaultAddress" v-model="addressForm.isDefault">
                              <label class="form-check-label" for="modalDefaultAddress">
                                Đặt làm địa chỉ mặc định
                              </label>
                            </div>
                            <div class="modal-footer p-0 pt-3">
                               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                               <button type="submit" class="btn btn-success">Lưu địa chỉ</button>
                            </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

             <!-- Password Tab Content -->
             <div v-else-if="activeTab === 'password'">
                 <h4 class="card-title mb-4 text-success fw-semibold">Đổi mật khẩu</h4>
                 <form @submit.prevent="changePassword" class="needs-validation" novalidate>
                   <div class="mb-3">
                     <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
                     <input
                       id="currentPassword"
                       v-model="passwordData.currentPassword"
                       type="password"
                       class="form-control"
                       required
                     >
                     <div class="invalid-feedback">Vui lòng nhập mật khẩu hiện tại.</div>
                   </div>
                   <div class="mb-3">
                     <label for="newPassword" class="form-label">Mật khẩu mới</label>
                     <input
                       id="newPassword"
                       v-model="passwordData.newPassword"
                       type="password"
                       class="form-control"
                       required
                       minlength="6"
                     >
                     <div class="form-text">Mật khẩu mới phải có ít nhất 6 ký tự.</div>
                     <div class="invalid-feedback">Vui lòng nhập mật khẩu mới (ít nhất 6 ký tự).</div>
                   </div>
                   <div class="mb-3">
                     <label for="confirmPassword" class="form-label">Xác nhận mật khẩu mới</label>
                     <input
                       id="confirmPassword"
                       v-model="passwordData.confirmPassword"
                       type="password"
                       class="form-control"
                       required
                     >
                     <div class="invalid-feedback">Vui lòng xác nhận mật khẩu mới.</div>
                      <div v-if="passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword" class="text-danger mt-1" style="font-size: 0.875em;">
                         Mật khẩu xác nhận không khớp.
                      </div>
                   </div>
                   <button
                     type="submit"
                     class="btn btn-success px-4"
                     :disabled="loading || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6"
                   >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <i v-else class="fas fa-key me-2"></i>
                     <span>{{ loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}</span>
                   </button>
                 </form>
             </div>

              <!-- Notifications Tab Content -->
              <div v-else-if="activeTab === 'notifications'">
                   <h4 class="card-title mb-4 text-success fw-semibold">Cài đặt thông báo</h4>
                   <div class="list-group">
                      <label class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                           <div class="fw-medium">Thông báo về đơn hàng</div>
                           <small class="text-muted d-block">Nhận thông báo khi đơn hàng có cập nhật trạng thái.</small>
                        </div>
                        <div class="form-check form-switch">
                           <input class="form-check-input" type="checkbox" role="switch" id="notif-orders" v-model="notificationSettings.orders">
                         </div>
                      </label>
                      <label class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                           <div class="fw-medium">Thông báo về khuyến mãi</div>
                           <small class="text-muted d-block">Nhận thông báo về các chương trình khuyến mãi, sản phẩm mới.</small>
                        </div>
                        <div class="form-check form-switch">
                           <input class="form-check-input" type="checkbox" role="switch" id="notif-promotions" v-model="notificationSettings.promotions">
                         </div>
                      </label>
                      <label class="list-group-item d-flex justify-content-between align-items-center">
                         <div>
                           <div class="fw-medium">Thông báo qua email</div>
                           <small class="text-muted d-block">Nhận bản tóm tắt và các thông báo quan trọng qua email.</small>
                         </div>
                         <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="notif-email" v-model="notificationSettings.email">
                          </div>
                      </label>
                   </div>
                   <div class="mt-4">
                      <button
                        @click="saveNotificationSettings"
                        class="btn btn-success px-4"
                      >
                        <i class="fas fa-save me-2"></i> Lưu cài đặt
                      </button>
                   </div>
              </div>

              <!-- Seller Registration Tab Content -->
              <div v-else-if="activeTab === 'seller'">
                  <h4 class="card-title mb-4 text-success fw-semibold">Đăng ký trở thành Người bán</h4>
                  <p class="text-muted mb-4">
                    Đưa sản phẩm OCOP chất lượng của bạn đến với cộng đồng. Đăng ký gian hàng ngay hôm nay để bắt đầu!
                  </p>
                  <div class="alert alert-warning d-flex align-items-center" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    <div>
                      Bạn cần chuẩn bị Giấy chứng nhận sản phẩm OCOP và các giấy tờ pháp lý liên quan để hoàn tất đăng ký.
                    </div>
                  </div>
                   <router-link
                     to="/register-distributor"
                     class="btn btn-success px-4 mt-3"
                   >
                      <i class="fas fa-store me-2"></i> Bắt đầu đăng ký
                   </router-link>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// Import Bootstrap JS để sử dụng Modal programmatically (nếu cần)
import { Modal } from 'bootstrap';
// Import Font Awesome icons nếu cần thêm
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faReceipt, faMapMarkerAlt, faLock, faBell, faStore, faStoreAlt, faCog, faSignOutAlt, faSave, faPlus, faEdit, faTrash, faKey, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faUserCircle, faReceipt, faMapMarkerAlt, faLock, faBell, faStore, faStoreAlt, faCog, faSignOutAlt, faSave, faPlus, faEdit, faTrash, faKey, faInfoCircle);


export default {
  name: 'UserProfile',
  data() {
    return {
      activeTab: 'profile',
      loading: false, // Loading state cho các hành động (update profile, đổi pass)
      profileData: {
        name: '',
        email: '',
        phone: '',
        birthdate: '', // Format YYYY-MM-DD
        gender: 'male'
      },
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      addresses: [], // Sẽ load từ user profile hoặc API riêng
      showAddAddressForm: false, // Trạng thái ẩn/hiện modal (không cần nữa nếu dùng Bootstrap Modal)
      addressModalInstance: null, // Instance của Bootstrap Modal
      editingAddressIndex: null, // null = thêm mới, index = sửa
      addressForm: {
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        isDefault: false
      },
      notificationSettings: {
        orders: true,
        promotions: true,
        email: true
      }
    };
  },
  computed: {
    ...mapGetters({
       // Lấy user từ auth module
      user: 'auth/currentUser',
       // Lấy profile từ user module (nếu có)
      // userProfileData: 'user/userProfile'
    }),
    userInitials() {
      if (!this.user || !this.user.name) return '??';
      const nameParts = this.user.name.split(' ').filter(Boolean);
      if (nameParts.length === 0) return '??';
      if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    },
    // Có thể thêm computed properties cho loading/error từ các module khác nếu cần
    // authLoading: state => state.auth.loading,
    // userLoading: state => state.user.loading,
  },
  methods: {
    ...mapActions({
       // Lấy từ user module thay vì auth nếu có
      // updateProfileAction: 'user/updateUserProfile',
      logout: 'auth/logout',
       // Giả sử có action đổi mật khẩu
      // changePasswordAction: 'auth/changePassword',
       // Giả sử có actions quản lý địa chỉ
      // fetchAddressesAction: 'user/fetchAddresses',
      // addAddressAction: 'user/addAddress',
      // updateAddressAction: 'user/updateAddress',
      // deleteAddressAction: 'user/deleteAddress',
      // setDefaultAddressAction: 'user/setDefaultAddress',
       // Giả sử có action lưu cài đặt thông báo
      // saveNotificationSettingsAction: 'user/saveNotificationSettings'
    }),

    async updateUserProfile(event) {
       const form = event.target;
       if (!form.checkValidity()) {
         event.preventDefault();
         event.stopPropagation();
         form.classList.add('was-validated');
         return;
       }
       form.classList.add('was-validated'); // Hiển thị validation styles

       this.loading = true;
       try {
          // Gọi action cập nhật profile (cần tạo action này trong user.js)
         // await this.updateProfileAction(this.profileData);

          // --- GIẢ LẬP UPDATE ---
          console.log("Updating profile with:", this.profileData);
          await new Promise(res => setTimeout(res, 1000)); // Giả lập chờ
           // Cập nhật user trong auth state để Navbar thấy thay đổi
           this.$store.commit('auth/SET_AUTH_USER', { ...this.user, ...this.profileData });
          // --- KẾT THÚC GIẢ LẬP ---

          this.$toast.success('Cập nhật thông tin thành công!'); // Sử dụng toast nếu đã cài
       } catch (error) {
         console.error('Update profile error:', error);
         this.$toast.error(error.response?.data?.message || 'Cập nhật thông tin thất bại.');
       } finally {
         this.loading = false;
         form.classList.remove('was-validated'); // Reset validation state
       }
    },

    async changePassword(event) {
       const form = event.target;
       if (!form.checkValidity() || this.passwordData.newPassword !== this.passwordData.confirmPassword) {
         event.preventDefault();
         event.stopPropagation();
         form.classList.add('was-validated');
         return;
       }
       form.classList.add('was-validated');

       this.loading = true;
       try {
         // Gọi API đổi mật khẩu
         // await this.changePasswordAction({
         //   currentPassword: this.passwordData.currentPassword,
         //   newPassword: this.passwordData.newPassword,
         // });

          // --- GIẢ LẬP ĐỔI PASS ---
          console.log("Changing password...");
          await new Promise(res => setTimeout(res, 1500));
          // --- KẾT THÚC GIẢ LẬP ---

         this.$toast.success('Đổi mật khẩu thành công!');
         // Reset form
         this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
         form.classList.remove('was-validated'); // Reset validation

       } catch (error) {
         console.error('Change password error:', error);
         this.$toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
       } finally {
         this.loading = false;
       }
    },

    // --- Address Methods ---
    openAddAddressModal() {
        this.editingAddressIndex = null; // Đảm bảo là thêm mới
        this.resetAddressForm();
        this.addressModalInstance?.show();
    },
    openEditAddressModal(index) {
        this.editingAddressIndex = index;
        // Sao chép dữ liệu address cần sửa vào form, cần deep copy nếu phức tạp
        this.addressForm = JSON.parse(JSON.stringify(this.addresses[index]));
        this.addressModalInstance?.show();
    },
    async deleteAddress(index) {
      if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
         try {
            // await this.deleteAddressAction(this.addresses[index]._id); // Gọi API xóa
            // --- GIẢ LẬP XÓA ---
            this.addresses.splice(index, 1);
            // --- KẾT THÚC GIẢ LẬP ---
            this.$toast.success('Xóa địa chỉ thành công');
         } catch (error) {
             console.error("Delete address error:", error);
             this.$toast.error(error.response?.data?.message || 'Xóa địa chỉ thất bại.');
         }
      }
    },
     async setDefaultAddress(index) {
         try {
             // await this.setDefaultAddressAction(this.addresses[index]._id); // Gọi API set default
             // --- GIẢ LẬP SET DEFAULT ---
             this.addresses.forEach((addr, i) => {
                 addr.isDefault = (i === index);
             });
             // --- KẾT THÚC GIẢ LẬP ---
             this.$toast.success('Đã đặt địa chỉ mặc định');
         } catch (error) {
              console.error("Set default address error:", error);
              this.$toast.error(error.response?.data?.message || 'Đặt địa chỉ mặc định thất bại.');
         }
     },
    async saveAddress(event) {
       const form = event.target;
       if (!form.checkValidity()) {
         event.preventDefault();
         event.stopPropagation();
         form.classList.add('was-validated');
         return;
       }

       try {
         let savedAddress;
         if (this.editingAddressIndex !== null) {
            // Gọi API cập nhật địa chỉ
            // savedAddress = await this.updateAddressAction({
            //     addressId: this.addresses[this.editingAddressIndex]._id,
            //     addressData: this.addressForm
            // });

             // --- GIẢ LẬP UPDATE ADDRESS ---
             console.log("Updating address:", this.addressForm);
             await new Promise(res => setTimeout(res, 500));
             savedAddress = { ...this.addressForm, _id: this.addresses[this.editingAddressIndex]._id }; // Giả lập trả về _id cũ
             // --- KẾT THÚC GIẢ LẬP ---

             // Cập nhật lại mảng addresses
             const updatedAddresses = [...this.addresses];
             updatedAddresses[this.editingAddressIndex] = savedAddress;
             // Nếu địa chỉ mới được set là default, cập nhật các địa chỉ khác
             if (savedAddress.isDefault) {
                updatedAddresses.forEach((addr, i) => {
                    if (i !== this.editingAddressIndex) addr.isDefault = false;
                });
             }
             this.addresses = updatedAddresses;
             this.$toast.success('Cập nhật địa chỉ thành công');

         } else {
            // Gọi API thêm địa chỉ mới
            // savedAddress = await this.addAddressAction(this.addressForm);

             // --- GIẢ LẬP ADD ADDRESS ---
             console.log("Adding address:", this.addressForm);
             await new Promise(res => setTimeout(res, 500));
             savedAddress = { ...this.addressForm, _id: `new_${Date.now()}` }; // Giả lập _id mới
             // --- KẾT THÚC GIẢ LẬP ---

            // Cập nhật lại mảng addresses
             const newAddresses = [...this.addresses];
              // Nếu địa chỉ mới được set là default, cập nhật các địa chỉ khác
             if (savedAddress.isDefault) {
                 newAddresses.forEach(addr => { addr.isDefault = false; });
             } else if (newAddresses.length === 0) {
                  // Nếu là địa chỉ đầu tiên, tự động set default
                  savedAddress.isDefault = true;
             }
             newAddresses.push(savedAddress);
             this.addresses = newAddresses;
             this.$toast.success('Thêm địa chỉ thành công');
         }

         this.addressModalInstance?.hide(); // Đóng modal
         this.resetAddressForm();
         form.classList.remove('was-validated');

       } catch (error) {
          console.error("Save address error:", error);
          this.$toast.error(error.response?.data?.message || 'Lưu địa chỉ thất bại.');
          // Không đóng modal khi lỗi để user sửa lại
       }
    },
    resetAddressForm() {
      this.addressForm = {
        fullName: this.user?.name || '', // Lấy tên user làm mặc định
        phone: this.user?.phone || '',   // Lấy sđt user làm mặc định
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        isDefault: this.addresses.length === 0 // Tự động check nếu là địa chỉ đầu tiên
      };
      this.editingAddressIndex = null;
        // Reset validation state của form trong modal (nếu có)
        const modalForm = this.$refs.addressModalRef?.querySelector('form');
        modalForm?.classList.remove('was-validated');
    },

     // --- Notification Settings ---
     async saveNotificationSettings() {
         try {
             // await this.saveNotificationSettingsAction(this.notificationSettings);
             // --- GIẢ LẬP SAVE ---
             console.log("Saving notification settings:", this.notificationSettings);
             await new Promise(res => setTimeout(res, 500));
             // --- KẾT THÚC GIẢ LẬP ---
             this.$toast.success('Lưu cài đặt thông báo thành công');
         } catch (error) {
              console.error("Save notification settings error:", error);
              this.$toast.error(error.response?.data?.message || 'Lưu cài đặt thất bại.');
         }
     },

    // --- Load Initial Data ---
    loadUserProfile() {
        // Lấy thông tin user từ Vuex store (đã có sẵn)
       if (this.user) {
          // Format ngày sinh cho input type="date" (YYYY-MM-DD)
          let birthdateForInput = '';
          if (this.user.birthdate) {
              try {
                  birthdateForInput = new Date(this.user.birthdate).toISOString().split('T')[0];
              } catch(e) { console.error("Error formatting birthdate:", e); }
          }

          this.profileData = {
             name: this.user.name || '',
             email: this.user.email || '',
             phone: this.user.phone || '', // Giả sử có trường phone trong user model
             birthdate: birthdateForInput,
             gender: this.user.gender || 'male' // Giả sử có trường gender
          };

          // Load địa chỉ (tạm thời dùng mock data, cần action riêng)
          // await this.fetchAddressesAction(); // Gọi action lấy địa chỉ
          this.addresses = [ // Mock addresses
              { _id: 'addr1', fullName: this.user.name, phone: this.user.phone || '0912345678', province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', addressDetail: '123 Đường Đồng Khởi', isDefault: true },
              { _id: 'addr2', fullName: this.user.name, phone: '0988776655', province: 'Hà Nội', district: 'Ba Đình', ward: 'Phường Điện Biên', addressDetail: '456 Phố Hoàng Diệu', isDefault: false }
          ];

           // Load cài đặt thông báo (tạm thời dùng mock data)
           this.notificationSettings = { // Mock settings
              orders: true,
              promotions: false,
              email: true
           };

       } else {
           // Xử lý trường hợp không có user (ví dụ: redirect về login)
           this.$router.push('/login');
       }
    }
  },
  created() {
     // Load dữ liệu khi component được tạo
     this.loadUserProfile();
  },
   mounted() {
     // Khởi tạo Bootstrap Modal sau khi component được mount
     const modalElement = this.$refs.addressModalRef;
     if (modalElement) {
       this.addressModalInstance = new Modal(modalElement);
     }

     // Thêm listener để reset form khi modal bị ẩn (do bấm nút close hoặc click bên ngoài)
     modalElement?.addEventListener('hidden.bs.modal', () => {
        this.resetAddressForm();
     });
   },
   beforeUnmount() {
     // Hủy instance modal khi component bị hủy để tránh memory leak
     this.addressModalInstance?.dispose();
   }
};
</script>

<style scoped>
/* CSS cho sidebar active và các tùy chỉnh khác */
.list-group-item.active {
  z-index: 2; /* Đảm bảo item active đè lên các item khác */
}
.list-group-item-action:hover, .list-group-item-action:focus {
  z-index: 1;
  color: #0a58ca; /* Màu hover mặc định của Bootstrap */
  background-color: #e9ecef; /* Màu nền hover nhẹ */
}
/* Tùy chỉnh màu active nếu muốn khác màu success */
/* .list-group-item.active {
  background-color: #your-color;
  border-color: #your-color;
} */

/* CSS cho switch (Bootstrap 5.1+) */
.form-switch .form-check-input {
  width: 2.5em; /* Tăng kích thước switch */
  height: 1.25em;
  margin-left: -2.5em;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e"); /* Màu nút tròn mặc định */
  background-position: left center;
  border-radius: 2em;
  transition: background-position .15s ease-in-out;
}
.form-switch .form-check-input:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}
.form-switch .form-check-input:checked {
  background-position: right center;
   background-color: #198754; /* Màu nền khi checked (success) */
   border-color: #198754;
   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e"); /* Màu nút tròn khi checked */
}

/* Căn chỉnh icon trong list group */
.list-group-item i.fa-fw {
  width: 1.25em; /* Đảm bảo độ rộng cố định cho icon */
  text-align: center;
}
</style>