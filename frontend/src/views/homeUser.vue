<template>
  <div class="colorBody">
    <!-- Navbar -->
    <navBarUser />

    <!-- Banner Carousel -->
    <div class="container mt-3 mb-4" v-if="banners.length > 0">
      <div id="mainCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner rounded shadow">
          <div
            class="carousel-item"
            :class="{ active: index === 0 }"
            v-for="(banner, index) in banners"
            :key="index"
          >
            <img
              :src="'http://localhost:3000' + banner.imageUrl"
              class="d-block w-100 banner-img"
              alt="Banner"
            />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <!-- Category Section -->
    <div class="container mb-4">
      <h4 class="mb-3">Selected Categories</h4>
      <div class="d-flex overflow-auto gap-3 pb-2">
        <router-link
          v-for="cat in statePC.productCategories"
          :key="cat.id"
          :to="{ name: 'selectedCategory', params: { id: cat.id } }"
          class="text-center text-decoration-none text-dark"
        >
          <div class="rounded-circle overflow-hidden border" style="width: 90px; height: 90px;">
            <img
              :src="'http://localhost:3000' + (cat.iconUrl || '/uploads/productCategories/default.png')"
              alt="Category Icon"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
          <small class="d-block mt-1">{{ cat.categoriesName }}</small>
        </router-link>
      </div>
    </div>

    <!-- Product Recommendations -->
    <div class="container">
      <h4 class="mb-3">All Products</h4>
      <div class="row">
        <div class="col-md-2 mb-4" v-for="item in stateProduct.product" :key="item.id">
          <router-link
            :to="'/product/' + item.id"
            class="text-decoration-none text-dark"
          >
            <div class="card h-100 shadow-sm">
              <img
                :src="'http://localhost:3000' + (item.imageUrl || '/uploads/products/default.png')"
                class="card-img-top"
                alt="Product Image"
                style="height: 150px; object-fit: cover;"
              />
              <div class="card-body p-2">
                <h6 class="card-title mb-1">{{ item.name }}</h6>
                <p class="card-text mb-0" style="font-size: 0.75rem;">
                  Stok: <span class="text-muted">{{ item.stock }}</span>
                </p>
                <p class="card-text text-success fw-semibold" style="font-size: 0.9rem;">
                  Rp {{ item.price.toLocaleString() }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import productCRUD from "../modules/productCRUD.js";
import getProductCategories from "../modules/productCategoriesCRUD.js";
import { ref, onMounted } from "vue";

export default {
  name: "homeUser",
  components: {
    navBarUser,
  },
  setup() {
    const { stateProduct, getAllProductMainWarehouse } = productCRUD();
    const { statePC, getAllProductCategories } = getProductCategories();
    
    const banners = ref([]);

    const getBanners = async () => {
      try {
        const res = await fetch("https://bmp-inv-be.zenbytes.id/banner/");
        const data = await res.json();
        banners.value = data;
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };

    onMounted(() => {
      getAllProductMainWarehouse();
      getBanners();
      getAllProductCategories();
    });

    return { stateProduct, statePC, banners };
  }
};
</script>

<style scoped>
.colorBody {
  background-color: #ffffff;
  min-height: 100vh;
}

.banner-img {
  height: 300px;
  object-fit: fill;
  border-radius: 10px;
}
</style>
