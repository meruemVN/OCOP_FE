<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-title">
        <h2>Đăng nhập</h2>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="error" class="login-error">
          {{ error }}
        </div>
        <div class="login-field">
          <label for="email">Email</label>
          <input
            id="email"
            ref="emailInput"
            type="email"
            v-model.trim="email"
            @input="clearError"
            required
            autocomplete="username"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div class="login-field login-pw">
          <label for="password">Mật khẩu</label>
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @input="clearError"
            required
            autocomplete="current-password"
            placeholder="Nhập mật khẩu của bạn"
          />
          <button
            type="button"
            class="login-eye"
            @click="showPassword = !showPassword"
            tabindex="-1"
            aria-label="Hiển thị/Ẩn mật khẩu"
          >
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="login-forgot">
          <router-link to="/forgot-password">
            Quên mật khẩu?
          </router-link>
        </div>
        <button
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="login-loading"></span>
          <span v-if="loading"> Đang đăng nhập... </span>
          <span v-else>🔒 Đăng nhập</span>
        </button>
        <div class="login-register">
          Chưa có tài khoản? 
          <router-link to="/register">Đăng ký ngay</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const store = useStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const emailInput = ref(null);

const clearError = () => store.dispatch('clearError');
const loading = computed(() => store.getters['authLoading']);
const error = computed(() => store.getters['authError']);

const handleLogin = async () => {
  console.log('[Login.vue] Attempting login with Email:', email.value, 'Password:', password.value.substring(0,3) + '...'); // Không log toàn bộ password
  if (!email.value || !password.value) return;
  try {
    await store.dispatch('auth/login', { 
      email: email.value, 
      password: password.value 
    });
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    // Error handled in Vuex
    console.error('Login failed:', err);
  }
};

onMounted(() => {
  if (emailInput.value) emailInput.value.focus();
});
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e5f9f6 0%, #f0fff4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 32px 0 rgba(64,64,64,0.14);
  overflow: hidden;
  margin: 24px;
}
.login-title {
  padding: 32px 24px 0 24px;
  text-align: center;
}
.login-title h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #097969;
  margin: 0 0 8px 0;
}
.login-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-error {
  background: #ffeded;
  color: #b50000;
  border: 1px solid #ffb3b3;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 6px;
}
.login-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.login-field label {
  color: #097969;
  font-weight: 500;
  font-size: 1rem;
}
.login-field input {
  padding: 10px 12px;
  border: 1px solid #b6eada;
  border-radius: 8px;
  background: #f3fefd;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
}
.login-field input:focus {
  border: 1.5px solid #40c9a2;
  outline: none;
  background: #fff;
}
.login-pw {
  position: relative;
}
.login-eye {
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
.login-forgot {
  text-align: right;
  margin-bottom: 4px;
}
.login-forgot a {
  color: #097969;
  font-size: 0.96rem;
  text-decoration: none;
}
.login-forgot a:hover {
  text-decoration: underline;
}
.login-btn {
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
.login-btn:disabled, .login-btn[disabled] {
  opacity: 0.65;
  cursor: not-allowed;
}
.login-loading {
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
.login-register {
  text-align: center;
  color: #222;
  margin-top: 8px;
  font-size: 0.98rem;
}
.login-register a {
  color: #097969;
  font-weight: 500;
  text-decoration: none;
}
.login-register a:hover {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .login-container {
    margin: 12px;
    padding: 0;
  }
  .login-form {
    padding: 16px;
  }
  .login-title {
    padding-top: 18px;
    padding-bottom: 0;
  }
}
</style>