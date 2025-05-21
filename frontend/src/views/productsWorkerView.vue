<template>
  <div>
    <navBarInventory />
    <div class="container mt-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <router-link to="/newProductsWorker" class="text-decoration-none">
          <button class="btn btn-success">New</button>
        </router-link>
        <h5 class="mb-0">Products</h5>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Stock</th>
            <th scope="col">Category</th>
            <th scope="col">Unit</th>
            <th scope="col">Unit Conversion</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
            <th scope="col">Warehouse</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stateProduct.product" :key="item.id || item.name">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.categoryId }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.unitConversion || '-' }}</td>
            <td>Rp.{{ parseInt(item.price).toLocaleString('id') }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.warehouseId }}</td>
            <td>
              <span v-if="item.status === 1" class="badge bg-success">Active</span>
              <span v-else class="badge bg-secondary">Non-Active</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

  
<script>
import { onMounted } from 'vue';
import navBarInventory from '@/components/NavBarInventory.vue';
import productCRUD from '../modules/productCRUD.js';
import workerCRUD from '../modules/workerCRUD.js';

export default {
  name: "productsWorker",
  components: {
    navBarInventory,
  },
  setup() {
    const { stateProduct, getAllProductByWarehouse } = productCRUD();
    const { getOneWorker, stateWorker } = workerCRUD();

    const username = sessionStorage.getItem("username");

    const loadProductList = async () => {
      await getOneWorker(username);
      const warehouseId = stateWorker.workers.data?.warehouseId;
      if (warehouseId) {
        await getAllProductByWarehouse(warehouseId);
      } else {
        console.warn("Warehouse ID not found for user:", username);
      }
    };

    onMounted(() => {
      loadProductList();
    });

    return {
      stateProduct
    };
  }
};
</script>
<style scoped>
/* Optional enhancements */
</style>