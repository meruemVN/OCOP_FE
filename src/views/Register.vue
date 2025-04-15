<template>
  <div class="register-bg">
    <div class="register-container">
      <div class="register-title">
        <h2>Đăng ký tài khoản</h2>
      </div>
      <form @submit.prevent="handleRegister" class="register-form">
        <div v-if="error" class="register-error">
          {{ error }}
        </div>
        <div class="register-field">
          <label for="name">Họ và tên</label>
          <input
            id="name"
            type="text"
            v-model="name"
            required
            placeholder="Nhập họ và tên của bạn"
          />
        </div>
        <div class="register-field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            autocomplete="username"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div class="register-field">
          <label for="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            v-model="phone"
            required
            placeholder="Nhập số điện thoại của bạn"
          />
        </div>
        <div class="register-field">
          <label for="password">Mật khẩu</label>
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            autocomplete="new-password"
            minlength="6"
            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
          />
          <button
            type="button"
            class="register-eye"
            @click="showPassword = !showPassword"
            tabindex="-1"
            aria-label="Hiển thị/Ẩn mật khẩu"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="register-field">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            required
            autocomplete="new-password"
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            class="register-eye"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
            aria-label="Hiển thị/Ẩn mật khẩu"
          >
            {{ showConfirmPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="register-terms">
          <label>
            <input type="checkbox" v-model="agreeTerms" required class="register-checkbox" />
            <span>
              Tôi đồng ý với
              <router-link to="/terms">Điều khoản sử dụng</router-link>
              và
              <router-link to="/privacy">Chính sách bảo mật</router-link>
            </span>
          </label>
        </div>
        <button
          type="submit"
          class="register-btn"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="register-loading"></span>
          <span v-if="loading"> Đang xử lý... </span>
          <span v-else>📝 Đăng ký</span>
        </button>
        <div class="register-login">
          Đã có tài khoản?
          <router-link to="/login">Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const loading = computed(() => store.getters['auth/authLoading']);
const error = computed(() => store.getters['auth/authError']);

const isFormValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    email.value.trim() !== '' &&
    phone.value.trim() !== '' &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    agreeTerms.value
  );
});

const handleRegister = async () => {
  if (!isFormValid.value) return;
  try {
    await store.dispatch('auth/register', {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    });
    router.push('/');
  } catch (err) {
    // Error is handled in the Vuex action
    console.error('Registration failed:', err);
  }
};
</script>

<style scoped>
.register-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e5f9f6 0%, #f0fff4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px 0 rgba(64,64,64,0.14);
  overflow: hidden;
  margin: 24px;
}
.register-title {
  padding: 32px 24px 0 24px;
  text-align: center;
}
.register-title h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #097969;
  margin: 0 0 8px 0;
}
.register-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.register-error {
  background: #ffeded;
  color: #b50000;
  border: 1px solid #ffb3b3;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 6px;
}
.register-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}
.register-field label {
  color: #097969;
  font-weight: 500;
  font-size: 1rem;
}
.register-field input[type="text"],
.register-field input[type="email"],
.register-field input[type="tel"],
.register-field input[type="password"] {
  padding: 10px 12px;
  border: 1px solid #b6eada;
  border-radius: 8px;
  background: #f3fefd;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
}
.register-field input:focus {
  border: 1.5px solid #40c9a2;
  outline: none;
  background: #fff;
}
.register-eye {
  position: absolute;
  right: 12px;
  bottom: 11px;
  background: none;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
  color: #40c9a2;
  padding: 0;
}
.register-terms {
  font-size: 0.98rem;
}
.register-checkbox {
  accent-color: #19b978;
  margin-right: 7px;
}
.register-terms a {
  color: #097969;
  text-decoration: none;
  font-weight: 500;
}
.register-terms a:hover {
  text-decoration: underline;
}
.register-btn {
  margin-top: 8px;
  width: 100%;
  background: linear-gradient(90deg, #2ad98f 0%, #19b978 100%);
  color: #fff;
  font-weight: bold;
  font-size: 1.08rem;
  padding: 12px 0;
  border: none;
  border-radius: 24px;
  box-shadow: 0 2px 8px 0 #b9f2d5;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.register-btn:disabled, .register-btn[disabled] {
  opacity: 0.65;
  cursor: not-allowed;
}
.register-loading {
  border: 3px solid #fff;
  border-top: 3px solid #19b978;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.register-login {
  text-align: center;
  color: #222;
  margin-top: 8px;
  font-size: 0.98rem;
}
.register-login a {
  color: #097969;
  font-weight: 500;
  text-decoration: none;
}
.register-login a:hover {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .register-container {
    margin: 12px;
    padding: 0;
  }
  .register-form {
    padding: 16px;
  }
  .register-title {
    padding-top: 18px;
    padding-bottom: 0;
  }
}
</style>