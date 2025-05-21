<template>
  <div>
    <navBarInventory />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Daftar Produk</h2>

      <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Stok</th>
            <th>Kategori</th>
            <th>Satuan</th>
            <th>Konversi Satuan</th>
            <th>Harga</th>
            <th>Deskripsi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stateProduct.product" :key="item.id || index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.categoryId }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.unitConversion || '-' }}</td>
            <td>Rp.{{ parseInt(item.price).toLocaleString('id') }}</td>
            <td>{{ item.description }}</td>
            <td>
              <span :class="item.status === 1 ? 'text-success fw-bold' : 'text-muted'">
                {{ item.status === 1 ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td>
              <router-link :to="`/detailedProduct/${item.id}`">
                <button class="btn btn-outline-success btn-sm">
                  Edit / Restok
                </button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import productCRUD from "../modules/productCRUD.js";
import workerCRUD from "../modules/workerCRUD.js";
import { onMounted } from "vue";

export default {
  name: "detailedProductWorker",
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
      }
    };

    onMounted(() => {
      loadProductList();
    });

    return {
      stateProduct,
    };
  },
};
</script>
