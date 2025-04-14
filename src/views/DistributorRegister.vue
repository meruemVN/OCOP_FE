<!-- src/views/DistributorRegister.vue -->
<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-semibold text-green-800 mb-6">Đăng ký làm nhà phân phối</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div v-if="loading" class="flex justify-center py-6">
          <div class="loader"></div>
        </div>
        
        <form v-else @submit.prevent="submitForm" class="space-y-4">
          <div class="form-group">
            <label for="name" class="block text-gray-700 font-medium mb-2">Tên doanh nghiệp</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.businessName" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
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
            <label for="phone" class="block text-gray-700 font-medium mb-2">Số điện thoại liên hệ</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="businessLicense" class="block text-gray-700 font-medium mb-2">Mã số doanh nghiệp/Giấy phép kinh doanh</label>
            <input 
              type="text" 
              id="businessLicense" 
              v-model="formData.businessLicense" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="serviceArea" class="block text-gray-700 font-medium mb-2">Khu vực phục vụ</label>
            <select 
              id="serviceArea" 
              v-model="formData.serviceArea" 
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Chọn khu vực</option>
              <option value="north">Miền Bắc</option>
              <option value="central">Miền Trung</option>
              <option value="south">Miền Nam</option>
              <option value="nationwide">Toàn quốc</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="description" class="block text-gray-700 font-medium mb-2">Mô tả về doanh nghiệp</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              rows="4"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>
          
          <div class="mt-6">
            <button 
              type="submit" 
              class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'DistributorRegister',
    data() {
      return {
        loading: false,
        formData: {
          businessName: '',
          address: '',
          phone: '',
          businessLicense: '',
          serviceArea: '',
          description: ''
        }
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/currentUser'
      })
    },
    methods: {
      async submitForm() {
        try {
          this.loading = true;
          // In a real application, you would dispatch an action to your Vuex store
          // For example: await this.$store.dispatch('distributor/registerDistributor', this.formData)
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          this.$router.push({ name: 'UserProfile' });
          alert('Đăng ký thành công! Chúng tôi sẽ xét duyệt và thông báo cho bạn trong vòng 3-5 ngày làm việc.');
        } catch (error) {
          console.error('Registration error:', error);
          alert('Đăng ký thất bại. Vui lòng thử lại sau.');
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