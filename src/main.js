import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Icons ALREADY in your main.js (keep them)
import { faUser, faHome, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// Icons that were in ProductDetail.vue (ADD THESE)
import {
    faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBag as faShoppingBagDetail, // Renamed to avoid conflict if same name
    faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle,
    faShippingFast, faCogs, faQuestionCircle, faArrowLeft,
    faStar as fasStar, faCartPlus, faMinus, faPlus, faStoreAlt,
    faStore, faBolt, faTags, faLeaf, faLightbulb, faSearch,
    faExclamationCircle, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

// Import for regular (empty) stars (if you use them as `far fa-star`)
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

// If you decide to use the PayPal icon
// import { faPaypal } from '@fortawesome/free-brands-svg-icons';

import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import './assets/css/footer.css';

// Add ALL icons to the library
library.add(
    // Existing icons
    faUser, faHome, faSignOutAlt, faShoppingCart,

    // Icons from ProductDetail.vue
    faFileInvoice, faMapMarkerAlt, faCreditCard, faShoppingBagDetail,
    faFileInvoiceDollar, faUserShield, faCheckCircle, faTimesCircle,
    faShippingFast, faCogs, faQuestionCircle, faArrowLeft,
    fasStar, // Solid star
    farStar, // Regular (empty) star
    faCartPlus, faMinus, faPlus, faStoreAlt,
    faStore, faBolt, faTags, faLeaf, faLightbulb, faSearch,
    faExclamationCircle, faPaperPlane
    // faPaypal // Add if you uncomment its import
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

const toastOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
};

app.use(store)
   .use(router)
   .use(Toast, toastOptions)
   .mount('#app');