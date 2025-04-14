<template>
    <section class="testimonials py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-semibold text-green-800 mb-2 text-center">Khách hàng nói gì về chúng tôi</h2>
        <p class="text-gray-600 mb-8 text-center">Những đánh giá từ người đã sử dụng sản phẩm OCOP</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" 
               class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="font-medium text-gray-800">{{ testimonial.name }}</h4>
                <p class="text-gray-500 text-sm">{{ testimonial.location }}</p>
              </div>
            </div>
            
            <div class="mb-4 text-yellow-400">
              <span v-for="i in testimonial.rating" :key="i">★</span>
            </div>
            
            <p class="text-gray-700 italic">{{ testimonial.content }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'TestimonialsSection',
    data() {
      return {
        testimonials: [
          {
            name: 'Nguyễn Văn A',
            location: 'Hà Nội',
            rating: 5,
            content: 'Tôi rất hài lòng với chất lượng các sản phẩm OCOP. Mật ong rừng U Minh tôi mua có hương vị tuyệt vời và nguồn gốc rõ ràng.',
            avatar: require('@/assets/avatars/avatar1.jpg')
          },
          {
            name: 'Trần Thị B',
            location: 'TP Hồ Chí Minh',
            rating: 5,
            content: 'Lần đầu tiên tôi thử các sản phẩm OCOP và đã trở thành khách hàng thường xuyên. Giá cả hợp lý mà chất lượng rất tốt.',
            avatar: require('@/assets/avatars/avatar2.jpg')
          },
          {
            name: 'Lê Văn C',
            location: 'Đà Nẵng',
            rating: 4,
            content: 'Tôi rất thích các sản phẩm thủ công mỹ nghệ từ làng nghề truyền thống. Giao hàng nhanh và đóng gói cẩn thận.',
            avatar: require('@/assets/avatars/avatar3.jpg')
          }
        ]
      }
    }
  }
  </script>