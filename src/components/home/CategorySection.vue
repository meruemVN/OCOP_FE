<template>
    <section class="category-section container">
      <h2 class="text-center mb-4 fw-bold text-success">Danh mục nổi bật</h2>
      <div class="row g-3 justify-content-center">
        <!-- Example Categories - Loop through actual categories later -->
        <div class="col-6 col-md-4 col-lg-2">
          <div class="card text-center shadow-sm h-100">
            <div class="card-body d-flex flex-column justify-content-center">
              {/* Placeholder for icon */}
              <i class="fas fa-carrot fa-2x text-warning mb-2"></i>
              <router-link to="/products?category=nong-san" class="stretched-link text-decoration-none text-dark">Nông sản</router-link>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="card text-center shadow-sm h-100">
             <div class="card-body d-flex flex-column justify-content-center">
               <i class="fas fa-wine-bottle fa-2x text-danger mb-2"></i>
               <router-link to="/products?category=thuc-pham" class="stretched-link text-decoration-none text-dark">Thực phẩm chế biến</router-link>
             </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
           <div class="card text-center shadow-sm h-100">
             <div class="card-body d-flex flex-column justify-content-center">
               <i class="fas fa-leaf fa-2x text-info mb-2"></i>
               <router-link to="/products?category=thao-duoc" class="stretched-link text-decoration-none text-dark">Thảo dược</router-link>
             </div>
           </div>
        </div>
         <div class="col-6 col-md-4 col-lg-2">
           <div class="card text-center shadow-sm h-100">
             <div class="card-body d-flex flex-column justify-content-center">
               <i class="fas fa-tshirt fa-2x text-primary mb-2"></i>
               <router-link to="/products?category=vai-may-mac" class="stretched-link text-decoration-none text-dark">Vải & May Mặc</router-link>
             </div>
           </div>
         </div>
         {/* Add more categories as needed */}
      </div>
    </section>
  </template>
  
  <script setup>
  // Later, you might fetch categories from an API here
  import { RouterLink } from 'vue-router';
  // Assuming you have Font Awesome setup for icons
  </script>
  
  <style scoped>
  .card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; /* Increase shadow on hover */
  }
  .card-body i {
      margin: 0 auto 0.5rem auto; /* Center icon horizontally */
  }
  </style>