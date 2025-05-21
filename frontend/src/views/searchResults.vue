<template>
  <div>
    <navBarUser />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">
        Hasil pencarian untuk: "{{ route.query.q }}"
      </h3>

      <div v-if="filteredProducts.length > 0" class="row">
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="col-md-3 mb-4"
        >
          <router-link
            :to="`/product/${product.id}`"
            class="text-decoration-none text-dark"
          >
            <div class="card h-100 shadow-sm">
              <img
                :src="'http://localhost:3000' + (product.imageUrl || '/uploads/products/default.png')"
                class="card-img-top"
                alt="Product Image"
                style="height: 200px; object-fit: cover"
              />
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text mb-1">
                  Kategori: <span class="text-muted">{{ product.category }}</span>
                </p>
                <p class="card-text text-success fw-semibold">
                  Rp {{ product.price.toLocaleString() }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        <i class="bi bi-search fs-1"></i>
        <p class="mt-3">Tidak ada produk ditemukan untuk keyword tersebut.</p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import navBarUser from "@/components/navBarUser.vue";
import productCRUD from "@/modules/productCRUD.js";

export default {
  name: "searchResult",
  components: { navBarUser },
  setup() {
    const route = useRoute();
    const { getAllProductMainWarehouse, stateProduct } = productCRUD();

    const filteredProducts = ref([]);
    const allProducts = ref([]);

    const fetchAndFilter = async () => {
      const keyword = (route.query.q || "").toLowerCase().trim();
      await getAllProductMainWarehouse(); // fetch and update stateProduct.product

      allProducts.value = stateProduct.product || [];
      filteredProducts.value = allProducts.value.filter((p) =>
        (p.name || "").toLowerCase().includes(keyword)
      );
    };

    onMounted(fetchAndFilter);
    watch(() => route.query.q, fetchAndFilter);

    return {
      route,
      filteredProducts,
      getAllProductMainWarehouse,
      stateProduct
    };
  },
};

</script>
