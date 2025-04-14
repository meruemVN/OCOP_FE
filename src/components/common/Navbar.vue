<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container"> {/* Or container-fluid for full width */}
      <!-- Logo / Brand Name -->
      <router-link to="/" class="navbar-brand">
        MyApp
      </router-link>

      <!-- Mobile Menu Button (Toggler) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links (Collapsible Content) -->
      <div class="collapse navbar-collapse" id="navbarNav">
        {/* --- Main Nav Links --- */}
        <ul class="navbar-nav me-auto mb-2 mb-lg-0"> {/* Changed ms-auto to me-auto to align left */}
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              active-class="active"
              exact-active-class="active"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/about"
              class="nav-link"
              active-class="active"
            >
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/contact"
              class="nav-link"
              active-class="active"
            >
              Contact
            </router-link>
          </li>
        </ul>

        {/* --- Search Form --- */}
        <form class="d-flex mx-lg-2 my-2 my-lg-0" role="search" @submit.prevent="handleSearch">
          <input
             v-model="searchQuery"
             class="form-control me-2"
             type="search"
             placeholder="Search..."
             aria-label="Search">
          <button class="btn btn-outline-success" type="submit">
             <font-awesome-icon :icon="['fas', 'search']" />
          </button>
        </form>

        {/* --- Right Aligned Items (Account) --- */}
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0"> {/* Separate UL with ms-auto */}
          {/* Example Dropdown (Optional) */}
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon :icon="['fas', 'user']" /> Account
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/settings">Settings</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout">
                  <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="me-1"/> Logout
                 </a>
              </li>
            </ul>
          </li>
        </ul>
      </div> {/* End .navbar-collapse */}
    </div> {/* End .container */}
  </nav>
</template>

<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // Uncomment if you navigate on search

// const router = useRouter(); // Uncomment if you navigate on search
const searchQuery = ref('');

const logout = () => {
  console.log("Logout action triggered");
  // Add your actual logout logic here
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return; // Prevent empty search
  console.log("Searching for:", searchQuery.value);
  // Add your search logic here
  // Option 1: Navigate to a search results page
  // router.push({ name: 'search', query: { q: searchQuery.value } });
  // Option 2: Emit an event to parent component
  // emit('search', searchQuery.value);
  // Option 3: Call a method in a store (Vuex/Pinia)
  // store.dispatch('performSearch', searchQuery.value);

  // Clear search query after handling (optional)
  // searchQuery.value = '';
}

</script>

<style scoped>
/* Ensure active class from router applies correctly */
.nav-link.active {
   font-weight: bold; /* Example */
}

/* Minor adjustments for search form spacing if needed */
/* .d-flex.mx-lg-2 { */
   /* Add specific spacing rules */
/* } */

</style>