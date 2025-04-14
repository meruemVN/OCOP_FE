<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
    <div class="py-4 px-6 bg-green-700 text-white text-center">
      <h2 class="text-2xl font-bold">Đăng nhập</h2>
    </div>
    
    <form @submit.prevent="handleLogin" class="py-6 px-8">
      <div class="mb-4" v-if="error">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
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
      
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Mật khẩu
        </label>
        <input 
          id="password"
          type="password" 
          v-model="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập mật khẩu của bạn"
        />
        <div class="mt-1 text-right">
          <router-link to="/forgot-password" class="text-sm text-green-700 hover:text-green-800">
            Quên mật khẩu?
          </router-link>
        </div>
      </div>
      
      <div class="mb-6">
        <button 
          type="submit" 
          class="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          :disabled="loading"
        >
          <span v-if="loading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>
      </div>
      
      <div class="text-center text-gray-700">
        <p>Chưa có tài khoản? 
          <router-link to="/register" class="text-green-700 hover:text-green-800 font-medium">
            Đăng ký ngay
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'Login',
  
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const email = ref('');
    const password = ref('');
    const loading = computed(() => store.getters['auth/authLoading']);
    const error = computed(() => store.getters['auth/authError']);
    
    const handleLogin = async () => {
      try {
        await store.dispatch('auth/login', { 
          email: email.value, 
          password: password.value 
        });
        
        // Redirect to intended page or home
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
      } catch (err) {
        // Error is handled in the Vuex action
        console.error('Login failed:', err);
      }
    };
    
    return {
      email,
      password,
      loading,
      error,
      handleLogin
    };
  }
}
</script>