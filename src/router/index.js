// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

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
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { guest: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: '/distributor-register',
    name: 'DistributorRegister',
    component: () => import('@/views/DistributorRegister.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/distributor/channel',
    component: () => import('@/views/distributor/Channel.vue'),
    meta: { requiresAuth: true, role: 'distributor' }
  },
  {
    path: '/distributor/products',
    component: () => import('@/views/distributor/Products.vue'),
    meta: { requiresAuth: true, role: 'distributor' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'] || store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];
  const currentUser = store.getters['auth/currentUser'];

  // Yêu cầu đăng nhập
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
    // Chặn admin
    if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next({ name: 'Home' });
      return;
    }
    // Chặn role khác
    const requiredRole = to.meta.role;
    if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
      next({ name: 'Home' });
      return;
    }
    next();
  }
  // Yêu cầu khách (guest)
  else if (to.matched.some(record => record.meta.guest) && isLoggedIn) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;