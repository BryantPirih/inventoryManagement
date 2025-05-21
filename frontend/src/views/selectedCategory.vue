<template>
  <div>
    <navBarUser />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">
        Produk dalam kategori: "{{ categoryName || route.params.id }}"
      </h3>

      <div v-if="filteredProducts.length > 0" class="row">
        <div
          class="col-md-3 mb-4"
          v-for="product in filteredProducts"
          :key="product._id"
        >
          <router-link
            :to="'/product/' + product.id"
            class="text-decoration-none text-dark"
          >
            <div class="card h-100 shadow-sm">
              <img
                :src="'http://localhost:3000' + (product.imageUrl || '/uploads/products/default.png')"
                class="card-img-top"
                alt="Product Image"
                style="height: 200px; object-fit: cover;"
              />

              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text text-muted">
                  Rp {{ product.price.toLocaleString() }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        <i class="bi bi-box fs-1"></i>
        <p class="mt-3">Tidak ada produk dalam kategori ini.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import navBarUser from "@/components/navBarUser.vue";
import productCRUD from "@/modules/productCRUD.js";
import getProductCategories from "@/modules/productCategoriesCRUD.js";

export default {
  name: "selectedCategory",
  components: { navBarUser },
  setup() {
    const route = useRoute();
    const { getAllProductMainWarehouse, stateProduct } = productCRUD();
    const { getAllProductCategories, statePC } = getProductCategories();

    const filteredProducts = ref([]);
    const categoryName = ref("");

    const fetchAndFilter = async () => {
        const categoryId = route.params.id;
        await getAllProductMainWarehouse();
        await getAllProductCategories();

        const allProducts = stateProduct.product || [];

        filteredProducts.value = allProducts.filter(
            (p) => p.categoryId === categoryId
        );

        const matchedCat = statePC.productCategories.find(
            (cat) => cat.id === categoryId
        );
        categoryName.value = matchedCat ? matchedCat.categoriesName : "";
    };


    onMounted(fetchAndFilter);
    watch(() => route.params.id, fetchAndFilter);

    return {
      route,
      filteredProducts,
      categoryName,
      stateProduct
    };
  },
};
</script>
