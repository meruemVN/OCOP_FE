<!-- src/views/Shop/CreateShop.vue -->
<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-semibold text-green-800 mb-6">Tạo cửa hàng</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div v-if="loading" class="flex justify-center py-6">
          <div class="loader"></div>
        </div>
        
        <form v-else @submit.prevent="submitForm" class="space-y-4">
          <div class="form-group">
            <label for="shopName" class="block text-gray-700 font-medium mb-2">Tên cửa hàng</label>
            <input 
              type="text" 
              id="shopName" 
              v-model="formData.name" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="description" class="block text-gray-700 font-medium mb-2">Mô tả</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="address" class="block text-gray-700 font-medium mb-2">Địa chỉ</label>
            <input 
              type="text" 
              id="address" 
              v-model="formData.address" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="city" class="block text-gray-700 font-medium mb-2">Thành phố/Tỉnh</label>
            <input 
              type="text" 
              id="city" 
              v-model="formData.city" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="phone" class="block text-gray-700 font-medium mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="block text-gray-700 font-medium mb-2">Logo cửa hàng</label>
            <div class="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center">
              <input 
                type="file" 
                id="logo" 
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
                ref="logoInput"
              >
              <div v-if="logoPreview" class="mb-3">
                <img :src="logoPreview" alt="Logo preview" class="max-h-40 mx-auto">
                <button 
                  type="button"
                  @click="removeLogo"
                  class="text-red-500 text-sm mt-2"
                >
                  Xóa ảnh
                </button>
              </div>
              <button 
                type="button"
                @click="$refs.logoInput.click()"
                class="text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50"
              >
                Chọn ảnh
              </button>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              type="submit" 
              class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              Tạo cửa hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'CreateShop',
    data() {
      return {
        loading: false,
        logoPreview: null,
        formData: {
          name: '',
          description: '',
          address: '',
          city: '',
          phone: '',
          email: '',
          logo: null
        }
      };
    },
    methods: {
      ...mapActions({
        createShopAction: 'shop/createShop'
      }),
      
      handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.formData.logo = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = e => {
          this.logoPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      
      removeLogo() {
        this.logoPreview = null;
        this.formData.logo = null;
        this.$refs.logoInput.value = '';
      },
      
      async submitForm() {
        try {
          this.loading = true;
          
          // Create FormData object for file upload
          const formData = new FormData();
          Object.keys(this.formData).forEach(key => {
            formData.append(key, this.formData[key]);
          });
          
          await this.createShopAction(formData);
          
          this.$router.push({ name: 'UserProfile' });
        } catch (error) {
          console.error('Shop creation error:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #10B981;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>