// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Import store để kiểm tra login và role

// Định nghĩa các routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('@/views/ProductList.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
    props: true // Cho phép truyền param :id vào làm prop
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
    // Cart có thể truy cập bởi cả guest và user
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true } // Cần đăng nhập để checkout
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guestOnly: true } // Chỉ cho guest
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { guestOnly: true } // Chỉ cho guest
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'MyOrders',
    component: () => import('@/views/MyOrders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetail.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register-distributor', // Giữ nguyên path này
    name: 'DistributorRegister',
    component: () => import('@/views/DistributorRegister.vue'),
    meta: { requiresAuth: true } // Cần đăng nhập để đăng ký NPP
  },
  // Distributor Routes
  {
    path: '/distributor/channel',
    name: 'DistributorChannel', // Nên đặt tên cho route
    component: () => import('@/views/distributor/Channel.vue'),
    meta: { requiresAuth: true, role: 'distributor' } // Cần login + role distributor
  },
  {
    path: '/distributor/products',
    name: 'DistributorProducts', // Nên đặt tên
    component: () => import('@/views/distributor/Products.vue'),
    meta: { requiresAuth: true, role: 'distributor' }
  },
  // Thêm các route khác của distributor nếu cần (ví dụ: orders, profile gian hàng)

  // Admin Routes
  {
    path: '/admin/dashboard', // Route gốc cho admin dashboard
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' } // Cần login + role admin
  },
   // Thêm các route con hoặc route riêng cho quản lý của admin
   {
     path: '/admin/users',
     name: 'AdminUserList',
     component: () => import('@/views/admin/UserList.vue'), // Ví dụ component
     meta: { requiresAuth: true, role: 'admin' }
   },
   {
     path: '/admin/products',
     name: 'AdminProductList',
     component: () => import('@/views/admin/ProductList.vue'), // Ví dụ component
     meta: { requiresAuth: true, role: 'admin' }
   },
   // ... các route admin khác

  // Not Found Route (Luôn đặt cuối cùng)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

// Khởi tạo Router
const router = createRouter({
  // Sử dụng process.env.BASE_URL cho Vue CLI
  history: createWebHistory(process.env.BASE_URL), // <<=== SỬA LẠI Ở ĐÂY
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation Guard (Xác thực & Phân quyền)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  const requiredRole = to.meta.role; // Lấy role yêu cầu từ meta

  const isLoggedIn = store.getters['auth/isLoggedIn']; // Dùng getter chuẩn
  const currentUser = store.getters['auth/currentUser'];

  console.log(`[Router Guard] Navigating to: ${to.path}, Requires Auth: ${requiresAuth}, Guest Only: ${guestOnly}, Required Role: ${requiredRole}, Is Logged In: ${isLoggedIn}, Current User Role: ${currentUser?.role}`); // Log chi tiết

  if (requiresAuth) {
    // --- Route yêu cầu đăng nhập ---
    if (!isLoggedIn) {
       console.log('[Router Guard] Not logged in. Redirecting to Login.');
      // Nếu chưa đăng nhập, chuyển đến trang Login, lưu lại trang muốn vào
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      // Đã đăng nhập, kiểm tra role nếu route yêu cầu
      if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
         console.log(`[Router Guard] Role mismatch. Required: ${requiredRole}, User has: ${currentUser?.role}. Redirecting to Home.`);
        // Nếu role không khớp, chuyển về trang chủ (hoặc trang lỗi "Không có quyền")
        next({ name: 'Home' }); // Hoặc next({ name: 'Forbidden' }) nếu có trang lỗi riêng
      } else {
         console.log('[Router Guard] Auth and Role checks passed. Allowing navigation.');
        // Đã đăng nhập và đúng role (hoặc route không yêu cầu role) -> cho phép truy cập
        next();
      }
    }
  } else if (guestOnly) {
    // --- Route chỉ dành cho khách (chưa đăng nhập) ---
    if (isLoggedIn) {
       console.log('[Router Guard] Already logged in. Redirecting from guest-only route to Home.');
      // Nếu đã đăng nhập, chuyển về trang chủ
      next({ name: 'Home' });
    } else {
       console.log('[Router Guard] Guest route accessed by guest. Allowing navigation.');
      // Chưa đăng nhập -> cho phép truy cập
      next();
    }
  } else {
    // --- Route công khai, không yêu cầu đăng nhập hay guest ---
    console.log('[Router Guard] Public route. Allowing navigation.');
    next(); // Luôn cho phép truy cập
  }
});

export default router;