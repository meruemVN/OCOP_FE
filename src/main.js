import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Consider if you really need this

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faHome, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
// REMOVED: import '@fortawesome/fontawesome-free/css/all.css'; // Usually not needed with vue-fontawesome component

import Toast, { POSITION } from 'vue-toastification'; // Import POSITION if needed for options
import 'vue-toastification/dist/index.css';

import './assets/css/footer.css';

library.add(faUser, faHome, faSignOutAlt, faShoppingCart);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

// Example Toast options
const toastOptions = {
    position: POSITION.TOP_RIGHT, // Or "top-right"
    timeout: 3000, // Default 5000
    // ... other options
};

app.use(store)
   .use(router)
   .use(Toast, toastOptions) // Pass options here
   .mount('#app');