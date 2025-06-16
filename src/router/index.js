import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// --- View Imports (Lazy loading) ---

// General Public Views
const Home = () => import('@/views/Home.vue');
const ProductListPublic = () => import('@/views/ProductList.vue');
const ProductDetail = () => import('@/views/ProductDetail.vue');
const Cart = () => import('@/views/Cart.vue');
const NotFound = () => import('@/views/NotFound.vue');

// Auth Views
const Login = () => import('@/views/Login.vue');
const Register = () => import('@/views/Register.vue');

// Authenticated User Views (Đã được đưa ra cấp cao nhất)
const UserProfile = () => import('@/views/UserProfile.vue');
const MyOrders = () => import('@/views/MyOrders.vue');
const OrderDetail = () => import('@/views/OrderDetail.vue');
const Checkout = () => import('@/views/Checkout.vue');
const DistributorRegister = () => import('@/views/DistributorRegister.vue');

// Distributor Views
const DistributorDashboard = () => import('@/views/distributor/DistributorDashboard.vue');
const DistributorProducts = () => import('@/views/distributor/Products.vue');
const DistributorChannel = () => import('@/views/distributor/Channel.vue');
const DistributorOrders = () => import('@/views/distributor/DistributorOrders.vue');

// Admin Views
import AdminDashboard from '@/views/admin/Dashboard.vue';
const AdminUserList = () => import('@/views/admin/UserList.vue');
const AdminUserCreatePage = () => import('@/views/admin/AdminUserCreatePage.vue');
const AdminUserEditPage = () => import('@/views/admin/AdminUserEditPage.vue');
const AdminProductList = () => import('@/views/admin/ProductList.vue');
const AdminProductCreatePage = () => import('@/views/admin/AdminProductCreatePage.vue');
const AdminProductEditPage = () => import('@/views/admin/AdminProductEditPage.vue');
const AdminAllOrdersPage = () => import('@/views/admin/AdminAllOrdersPage.vue');
const AdminOrderDetailPage = () => import('@/views/admin/AdminOrderDetailPage.vue');
const AdminDistributorRequestList = () => import('@/views/admin/AdminDistributorRequestList.vue');
const AdminDistributorRequestDetailPage = () => import('@/views/admin/AdminDistributorRequestDetailPage.vue');


const routes = [
  // --- Public Routes ---
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'ProductList', component: ProductListPublic },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/cart', name: 'Cart', component: Cart },

  // --- Auth Routes ---
  { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true } },

  // --- Authenticated User Routes (Đã bỏ route cha /user) ---
  { path: '/profile', name: 'UserProfile', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/orders', name: 'MyOrders', component: MyOrders, meta: { requiresAuth: true } },
  { path: '/order/:id', name: 'OrderDetail', component: OrderDetail, props: true, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/register-distributor', name: 'DistributorRegister', component: DistributorRegister, meta: { requiresAuth: true } },


  // --- Distributor Routes ---
  {
    path: '/distributor',
    meta: { requiresAuth: true, role: 'distributor' },
    redirect: '/distributor/dashboard',
    children: [
      { path: 'dashboard', name: 'DistributorDashboard', component: DistributorDashboard },
      { path: 'products', name: 'DistributorProducts', component: DistributorProducts },
      { path: 'channel', name: 'DistributorChannel', component: DistributorChannel },
      { path: 'orders', name: 'DistributorOrders', component: DistributorOrders },
    ]
  },

  // --- Admin Routes ---
  {
    path: '/admin',
    meta: { requiresAuth: true, role: 'admin' },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      // User Management
      { path: 'users', name: 'AdminUserList', component: AdminUserList },
      { path: 'users/create', name: 'AdminUserCreate', component: AdminUserCreatePage },
      { path: 'users/edit/:id', name: 'AdminUserEdit', component: AdminUserEditPage, props: true },
      // Product Management
      { path: 'products', name: 'AdminAllProducts', component: AdminProductList },
      { path: 'products/create', name: 'AdminProductCreate', component: AdminProductCreatePage },
      { path: 'products/edit/:id', name: 'AdminProductEdit', component: AdminProductEditPage, props: true },
      // Order Management
      { path: 'all-orders', name: 'AdminAllOrders', component: AdminAllOrdersPage },
      { path: 'order-detail/:id', name: 'AdminOrderDetail', component: AdminOrderDetailPage, props: true },
      // Distributor Request Management
      { path: 'distributor-requests', name: 'AdminDistributorRequests', component: AdminDistributorRequestList },
      { path: 'distributor-request-detail/:id', name: 'AdminDistributorRequestDetail', component: AdminDistributorRequestDetailPage, props: true },
    ]
  },

  // Not Found Route
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Navigation Guard (Giữ nguyên và đã được cải thiện ở bước trước)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  // Lấy role từ meta của route sâu nhất có định nghĩa role, hoặc từ route cha
  const requiredRole = to.matched.reduce((role, record) => record.meta.role || role, null);

  const isLoggedIn = store.getters['auth/isLoggedIn'];
  const currentUser = store.getters['auth/currentUser'];

  // console.log(
  //   `[Router Guard] Navigating to: ${to.path} (name: ${String(to.name || '')}), ` +
  //   `Requires Auth: ${requiresAuth}, Guest Only: ${guestOnly}, ` +
  //   `Required Role: ${requiredRole || 'any'}, Is Logged In: ${isLoggedIn}, ` +
  //   `Current User Role: ${currentUser?.role || 'guest'}`
  // );

  if (requiresAuth) {
    if (!isLoggedIn) {
      // console.log('[Router Guard] Not logged in. Redirecting to Login.');
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      // Đã đăng nhập, kiểm tra role nếu route yêu cầu
      if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
        // console.log(`[Router Guard] Role mismatch. Required: ${requiredRole}, User has: ${currentUser?.role}. Redirecting to Home.`);
        // Có thể chuyển đến trang "Forbidden" (403) thay vì Home
        next({ name: 'Home' }); // Hoặc next({ name: 'ForbiddenPage' })
      } else {
        // console.log('[Router Guard] Auth and Role checks passed. Allowing navigation.');
        next();
      }
    }
  } else if (guestOnly) {
    if (isLoggedIn) {
      // console.log('[Router Guard] Already logged in. Redirecting from guest-only route to Home.');
      next({ name: 'Home' });
    } else {
      // console.log('[Router Guard] Guest route accessed by guest. Allowing navigation.');
      next();
    }
  } else {
    // Route công khai
    // console.log('[Router Guard] Public route. Allowing navigation.');
    next();
  }
});

export default router;