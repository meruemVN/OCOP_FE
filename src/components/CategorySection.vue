<template>
    <section class="categories container mx-auto my-16 px-4">
      <h2 class="text-2xl font-semibold text-green-800 mb-6">Danh mục sản phẩm OCOP</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="category in categories" :key="category.id" 
             class="category-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          <router-link :to="{ name: 'ProductList', query: { category: category.id } }">
            <div class="h-36 overflow-hidden">
              <img :src="category.image" :alt="category.name" class="w-full h-full object-cover">
            </div>
            <div class="p-4 text-center">
              <h3 class="font-medium text-gray-800">{{ category.name }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'CategorySection',
    data() {
      return {
        categories: [
          {
            id: 1,
            name: 'Thực phẩm',
            image: require('@/assets/categories/logo.png')
          },
          {
            id: 2,
            name: 'Đồ uống',
            image: require('@/assets/categories/logo copy 2.png')
          },
          {
            id: 3,
            name: 'Thảo dược',
            image: require('@/assets/categories/logo copy 3.png')
          },
          {
            id: 4,
            name: 'Vải & May mặc',
            image: require('@/assets/categories/logo copy 4.png')
          },
          {
            id: 5,
            name: 'Lưu niệm',
            image: require('@/assets/categories/logo copy.png')
          },
          {
            id: 6,
            name: 'Dịch vụ du lịch',
            image: require('@/assets/categories/logo copy 5.png')
          }
        ]
      }
    }
  }
  </script>