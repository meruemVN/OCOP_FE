<template>
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div class="py-4 px-6 bg-green-700 text-white text-center">
        <h2 class="text-2xl font-bold">Đăng ký tài khoản</h2>
      </div>
      
      <form @submit.prevent="handleRegister" class="py-6 px-8">
        <div class="mb-4" v-if="error">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="fullName">
            Họ và tên
          </label>
          <input 
            id="fullName"
            type="text" 
            v-model="fullName"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập họ và tên của bạn"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input 
            id="email"
            type="email" 
            v-model="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập email của bạn"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
            Số điện thoại
          </label>
          <input 
            id="phone"
            type="tel" 
            v-model="phone"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập số điện thoại của bạn"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mật khẩu
          </label>
          <input 
            id="password"
            type="password" 
            v-model="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword">
            Xác nhận mật khẩu
          </label>
          <input 
            id="confirmPassword"
            type="password" 
            v-model="confirmPassword"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập lại mật khẩu"
          />
        </div>
        
        <div class="mb-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="agreeTerms" required class="mr-2" />
            <span class="text-sm">
              Tôi đồng ý với 
              <router-link to="/terms" class="text-green-700 hover:text-green-800">
                Điều khoản sử dụng
              </router-link> 
              và 
              <router-link to="/privacy" class="text-green-700 hover:text-green-800">
                Chính sách bảo mật
              </router-link>
            </span>
          </label>
        </div>
        
        <div class="mb-6">
          <button 
            type="submit" 
            class="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading">Đang xử lý...</span>
            <span v-else>Đăng ký</span>
          </button>
        </div>
        
        <div class="text-center text-gray-700">
          <p>Đã có tài khoản? 
            <router-link to="/login" class="text-green-700 hover:text-green-800 font-medium">
              Đăng nhập
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Register',
    
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const fullName = ref('');
      const email = ref('');
      const phone = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const agreeTerms = ref(false);
      
      const loading = computed(() => store.getters['auth/authLoading']);
      const error = computed(() => store.getters['auth/authError']);
      
      const isFormValid = computed(() => {
        return fullName.value.trim() !== '' &&
               email.value.trim() !== '' &&
               phone.value.trim() !== '' &&
               password.value.length >= 8 &&
               password.value === confirmPassword.value &&
               agreeTerms.value;
      });
      
      const handleRegister = async () => {
        if (!isFormValid.value) return;
        
        try {
          await store.dispatch('auth/register', {
            fullName: fullName.value,
            email: email.value,
            phone: phone.value,
            password: password.value
          });
          
          // Redirect to home or account setup
          router.push('/');
        } catch (err) {
          // Error is handled in the Vuex action
          console.error('Registration failed:', err);
        }
      };
      
      return {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        agreeTerms,
        loading,
        error,
        isFormValid,
        handleRegister
      };
    }
  }
  </script>