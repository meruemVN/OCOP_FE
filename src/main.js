import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faShoppingCart, faUser, faSignOutAlt, 
  faStore, faCog, faClipboardList, faSearch,
  faPlus, faMinus, faTrash, faEdit, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

// Import Font Awesome icons
library.add(
  faShoppingCart, faUser, faSignOutAlt, 
  faStore, faCog, faClipboardList, faSearch,
  faPlus, faMinus, faTrash, faEdit, faChevronDown
);

// Create Vue app
const app = createApp(App);

// Register global components and plugins
app.component('font-awesome-icon', FontAwesomeIcon);

// Mount app with plugins
app.use(store)
   .use(router)
   .mount('#app');