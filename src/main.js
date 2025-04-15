import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap JS Bundle (if needed for other components)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// --- Correct Font Awesome imports ---
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faHome, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.css';

// Add icons to the library
library.add(faUser, faHome, faSignOutAlt, faShoppingCart);

// --- End Font Awesome imports ---

// *** Import your custom Footer CSS ***
import './assets/css/footer.css'; // Adjust path if needed

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(store)
   .use(router)
   .mount('#app');
