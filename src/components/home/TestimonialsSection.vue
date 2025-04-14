<template>
    <section class="testimonials-section bg-light py-5">
      <div class="container">
        <h2 class="text-center mb-5 fw-bold text-success">Khách hàng nói gì?</h2>
        <div class="row g-4">
          <!-- Example Testimonial 1 -->
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <blockquote class="blockquote mb-0">
                  <p class="fst-italic">
                    "Sản phẩm OCOP chất lượng rất tốt, nguồn gốc rõ ràng. Tôi hoàn toàn yên tâm khi sử dụng."
                  </p>
                  <footer class="blockquote-footer mt-2">Chị Lan Anh, <cite title="Source Title">Hà Nội</cite></footer>
                </blockquote>
              </div>
            </div>
          </div>
  
          <!-- Example Testimonial 2 -->
           <div class="col-md-6 col-lg-4">
             <div class="card h-100 shadow-sm">
               <div class="card-body">
                 <blockquote class="blockquote mb-0">
                   <p class="fst-italic">
                     "Giao hàng nhanh chóng, đóng gói cẩn thận. Dịch vụ khách hàng tuyệt vời!"
                   </p>
                   <footer class="blockquote-footer mt-2">Anh Minh Tuấn, <cite title="Source Title">TP. Hồ Chí Minh</cite></footer>
                 </blockquote>
               </div>
             </div>
           </div>
  
           <!-- Example Testimonial 3 -->
           <div class="col-md-6 col-lg-4 d-none d-lg-block"> {/* Hide on md, show on lg+ */}
             <div class="card h-100 shadow-sm">
               <div class="card-body">
                 <blockquote class="blockquote mb-0">
                   <p class="fst-italic">
                     "Đa dạng sản phẩm đặc sản vùng miền, rất tiện lợi để mua sắm và làm quà."
                   </p>
                   <footer class="blockquote-footer mt-2">Cô Thanh Thủy, <cite title="Source Title">Đà Nẵng</cite></footer>
                 </blockquote>
               </div>
             </div>
           </div>
        </div>
        {/* Optional: Add pagination or carousel controls later */}
      </div>
    </section>
  </template>
  
  <script setup>
  // Later, you might fetch testimonials from an API here
  </script>
  
  <style scoped>
  .blockquote-footer {
    font-size: 0.85em;
    color: #6c757d; /* Bootstrap's text-muted color */
  }
  .blockquote p {
    font-size: 0.95rem;
  }
  .card {
     border: none; /* Remove default card border if desired */
  }
  </style>