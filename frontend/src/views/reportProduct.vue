<template>
  <div>
    <navBarInventory />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">Laporan Stok Keseluruhan</h3>


      <!-- Warehouse Dropdown for Admin -->
      <div v-if="isAdmin" class="row mb-3">
        <div class="col-md-4">
          <label>Pilih Gudang:</label>
          <select v-model="selectedWarehouseId" class="form-select" @change="onWarehouseChange">
            <option disabled value="">-- Pilih Gudang --</option>
            <option v-for="w in allWarehouses" :key="w.id" :value="w.id">
              {{ w.warehouse }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filter Inputs -->
      <div class="row mb-3">
        <div class="col-md-2"><input v-model="filters.name" placeholder="Nama Produk" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.stock" placeholder="Stok" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.price" placeholder="Harga" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.warehouse" placeholder="Gudang" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.category" placeholder="Kategori" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.unit" placeholder="Satuan" class="form-control" /></div>
      </div>

      <!-- Product Table -->
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Stok</th>
            <th>Harga</th>
            <th>Gudang</th>
            <th>Kategori</th>
            <th>Satuan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredProducts" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.stock }}</td>
            <td>Rp.{{ parseInt(item.price).toLocaleString('id') }}</td>
            <td>{{ item.warehouseId }}</td>
            <td>{{ item.categoryId }}</td>
            <td>{{ item.unit }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredProducts.length === 0" class="text-muted">Tidak ada produk yang sesuai.</div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import getProduct from '@/modules/productCRUD.js';
import getWarehouse from '@/modules/warehouseCRUD.js';
import getWorker from '@/modules/workerCRUD.js';
import { onBeforeMount, computed, reactive, ref } from 'vue';

export default {
  name: 'StockReport',
  components: { navBarInventory },
  setup() {
    const { stateProduct, getAllProduct, getAllProductByWarehouse } = getProduct();
    const { state: stateWarehouse, getAllWarehouse } = getWarehouse();
    const { stateWorker, getOneWorker } = getWorker();

    const filters = reactive({
      name: '',
      stock: '',
      price: '',
      warehouse: '',
      category: '',
      unit: ''
    });

    const selectedWarehouseId = ref('');
    const allWarehouses = ref([]);
    const isAdmin = computed(() => sessionStorage.getItem('role') === '1');

    const filteredProducts = computed(() => {
      const products = Array.isArray(stateProduct.product) ? stateProduct.product : [];

      return products.filter((p) =>
        (!filters.name || (p.name || '').toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.stock || String(p.stock).includes(filters.stock)) &&
        (!filters.price || String(p.price).includes(filters.price)) &&
        (!filters.warehouse || (p.warehouseId || '').toLowerCase().includes(filters.warehouse.toLowerCase())) &&
        (!filters.category || (p.categoryId || '').toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.unit || (p.unit || '').toLowerCase().includes(filters.unit.toLowerCase()))
      );
    });

    const loadProductData = async () => {
      if (selectedWarehouseId.value) {
        await getAllProductByWarehouse(selectedWarehouseId.value);
      } else {
        await getAllProduct(); // fallback
      }
    };

    onBeforeMount(async () => {
      const username = sessionStorage.getItem('username');

      await getOneWorker(username);
      const worker = stateWorker.workers?.data;
      selectedWarehouseId.value = worker?.warehouseId || '';

      if (isAdmin.value) {
        await getAllWarehouse();
        allWarehouses.value = Array.isArray(stateWarehouse.warehouse?.data)
          ? stateWarehouse.warehouse.data
          : Array.isArray(stateWarehouse.warehouse)
            ? stateWarehouse.warehouse
            : [];
      }

      await loadProductData();
    });

    const onWarehouseChange = async () => {
      await getAllProductByWarehouse(selectedWarehouseId.value);
    };

    return {
      filters,
      filteredProducts,
      isAdmin,
      selectedWarehouseId,
      allWarehouses,
      onWarehouseChange
    };
  }
};
</script>

<style scoped>
th, td {
  vertical-align: middle !important;
}
</style>
