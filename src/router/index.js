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
    path: '/shop/create',
    name: 'CreateShop',
    component: () => import('@/views/Shop/CreateShop.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shop/:id',
    name: 'ShopDetail',
    component: () => import('@/views/Shop/ShopDetail.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/Admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
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
  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const isAdmin = store.getters['auth/isAdmin'];
  
  // Check for routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } 
  // Check for routes that require guests (non-authenticated users)
  else if (to.matched.some(record => record.meta.guest) && isLoggedIn) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;