<template>
    <div>
      <!-- Topbar for large screens -->
      <nav class="navbar bg-body-tertiary px-4 d-none d-lg-flex align-items-center justify-content-between">
        <!-- Brand -->
        <router-link to="/home" class="navbar-brand me-4">
          <img src="/logo%20neo.jpg" alt="Company Logo" style="height: 40px;" />
        </router-link>

  
        <!-- Search Bar -->
        <form @submit.prevent="goToSearchPage" class="d-flex flex-grow-1 me-4" style="max-width: 500px;" role="search">
          <input
            v-model="searchQuery"
            class="form-control me-2"
            type="search"
            placeholder="Cari produk..."
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>

        <!-- Right side -->
        <div class="d-flex align-items-center gap-3">
          <router-link to="/history" class="nav-link"><i class="bi bi-card-list fs-5"></i></router-link>
          <router-link to="/cart" class="nav-link"><i class="bi bi-cart fs-5"></i></router-link>
          <router-link to="/wishlist" class="nav-link"><i class="bi bi-heart fs-5"></i></router-link>
          <router-link to="/returnStatus" class="nav-link" title="Riwayat Retur"><i class="bi bi-arrow-counterclockwise fs-5"></i></router-link>
          <notificationBell />
          <router-link to="/addressLocation" class="nav-link"><i class="bi bi-geo-alt fs-5"></i></router-link>
          <router-link to="/userSettings" class="nav-link"><i class="bi bi-gear fs-5"></i></router-link>

          <!-- Hi, username -->
          <span class="text-muted small">Hi, {{ username }}</span>

          <!-- Logout -->
          <button @click="logout" class="btn btn-outline-danger ms-2">Logout</button>
        </div>
      </nav>
  
      <!-- Topbar for small screens (mobile) -->
      <nav class="navbar bg-body-tertiary d-flex d-lg-none justify-content-between px-3">
        <img src="/logo%20neo.jpg" alt="Logo" style="height: 30px;" />
        <button class="btn btn-outline-secondary" @click="toggleSidebar">
          <i class="bi bi-list fs-4"></i>
        </button>
      </nav>
  
      <!-- Sidebar (offcanvas) -->
      <div
        class="offcanvas-mobile"
        :class="{ 'offcanvas-show': isSidebarOpen }"
        @click.self="toggleSidebar"
      >
        <div class="offcanvas-content">
          <div class="offcanvas-header">
            <img src="/logo%20neo.jpg" alt="Logo" style="height: 30px;" />
            <button class="btn-close" @click="toggleSidebar"></button>
          </div>
          <div class="offcanvas-body d-flex flex-column gap-3">
  
            <!-- Search -->
            <form @submit.prevent="goToSearchPage" class="d-flex" role="search">
              <input
                v-model="searchQuery"
                class="form-control me-2"
                type="search"
                placeholder="Cari produk..."
                aria-label="Search"
              />
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>

  
            <!-- Icons -->
            <ul class="nav flex-column">
              <li class="nav-item"><router-link to="/history" class="nav-link"><i class="bi bi-card-list me-2"></i>History</router-link></li>
              <li class="nav-item"><router-link to="/cart" class="nav-link"><i class="bi bi-cart me-2"></i>Cart</router-link></li>
              <li class="nav-item"><router-link to="/wishlist" class="nav-link"><i class="bi bi-heart me-2"></i>Wishlist</router-link></li>
              <li class="nav-item"><router-link to="/returnStatus" class="nav-link"><i class="bi bi-arrow-counterclockwise me-2"></i>Retur</router-link></li>
              <li class="nav-item"><router-link to="" class="nav-link"><i class="bi bi-bell me-2"></i>Notifications</router-link></li>
              <li class="nav-item"><router-link to="/addressLocation" class="nav-link"><i class="bi bi-geo-alt me-2"></i>Location</router-link></li>
              <li class="nav-item"><router-link to="/userSettings" class="nav-link"><i class="bi bi-gear me-2"></i>Settings</router-link></li>
            </ul>
  
            <!-- Logout -->
            <button @click="logout" class="btn btn-outline-danger mt-4">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import notificationBell from '@/components/notificationBell.vue';

export default {
  name: "navBarUser",
  components: {
    notificationBell,
  },
  data() {
    return {
      isSidebarOpen: false,
      searchQuery: "",
      username: sessionStorage.getItem("username") || "User"
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    logout() {
      sessionStorage.clear();
      this.$router.push({ name: "login" });
    },
    goToSearchPage() {
      const keyword = this.searchQuery.trim();
      if (keyword) {
        this.$router.push({ name: "searchResults", query: { q: keyword } });
        this.searchQuery = ""; // clear after search
        this.isSidebarOpen = false; // optional: close sidebar on mobile
      }
    },
  },
};

  </script>
  
  <style scoped>
  /* Offcanvas sidebar for mobile */
  .offcanvas-mobile {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    background-color: white;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1055;
    visibility: hidden;
  }
  
  .offcanvas-show {
    transform: translateX(0);
    visibility: visible;
  }
  
  .offcanvas-content {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
  }
  </style>
  