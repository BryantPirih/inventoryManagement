<template>
  <div>
    <navBarInventory />
    
    <div class="container my-5">
      <h3 class="fw-bold mb-4">Laporan Penjualan Barang</h3>

      <!-- Date Filter -->
      <!-- Date Range Filter - Full Width Row -->
       <!-- Admin-only warehouse selector -->
      <div class="row mb-3" v-if="showDropdown">
        <div class="col-md-4">
          <label>Pilih Gudang</label>
          <select v-model="selectedWarehouseId" class="form-control" @change="applyDateFilter">
            <option disabled value="">-- Pilih Gudang --</option>
            <option value="">-- Semua Gudang --</option>
            <option v-for="w in state.warehouse" :key="w.id" :value="w.id">
              {{ w.warehouse }}
            </option>
          </select>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <label>Dari Tanggal</label>
          <input type="date" v-model="startDate" class="form-control" />
        </div>
        <div class="col-md-4">
          <label>Sampai Tanggal</label>
          <input type="date" v-model="endDate" class="form-control" />
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button class="btn btn-primary w-100" @click="applyDateFilter">Terapkan Filter</button>
        </div>
      </div>


      <!-- Header Filters -->
      <div class="row mb-2">
        <div class="col-md-3"><input v-model="filters.productName" placeholder="Produk" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.quantity" placeholder="Jumlah" class="form-control" /></div>
        <div class="col-md-3"><input v-model="filters.total" placeholder="Total Pendapatan" class="form-control" /></div>
        <div class="col-md-4"><input v-model="filters.date" placeholder="Tanggal (dd/mm/yyyy)" class="form-control" /></div>
      </div>

      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Jumlah Terjual</th>
            <th>Total Pendapatan</th>
            <th>Tanggal Order</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredRows" :key="index">
            <td>{{ row.productName }}</td>
            <td>{{ row.quantity }}</td>
            <td>Rp.{{ parseInt(row.total).toLocaleString('id') }}</td>
            <td>{{ formatDate(row.date) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredRows.length === 0" class="text-muted">
        Tidak ada data penjualan yang sesuai.
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import getOrder from '@/modules/orderCRUD.js';
import getProduct from '@/modules/productCRUD.js';
import getWorker from '@/modules/workerCRUD.js';
import getWarehouse from '@/modules/warehouseCRUD.js';
import { onBeforeMount, ref, computed } from 'vue';

export default {
  name: 'salesReport',
  components: { navBarInventory },
  setup() {
    const { stateOrder, getHistoryOrders } = getOrder();
    const { stateProduct, getAllProductMainWarehouse } = getProduct();
    const { stateWorker, getOneWorker } = getWorker();
    const { state, getAllWarehouse } = getWarehouse();

    const rawSales = ref([]);
    const startDate = ref('');
    const endDate = ref('');
    const filters = ref({
      productName: '',
      quantity: '',
      total: '',
      date: ''
    });

    const selectedWarehouseId = ref('');
    const role = ref('');
    const showDropdown = ref(false);

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('id-ID');
    };

    const applyDateFilter = () => {
      const allOrders = Array.isArray(stateOrder.order) ? stateOrder.order : [];

      const allProducts = Array.isArray(stateProduct.product?.data)
        ? stateProduct.product.data
        : Array.isArray(stateProduct.product)
          ? stateProduct.product
          : [];

      const completed = allOrders.filter(o =>
        o.status >= 4 &&
        (!selectedWarehouseId.value || o.warehouseId === selectedWarehouseId.value)
      );

      const temp = [];

      completed.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const includeDate =
          (!startDate.value || orderDate >= new Date(startDate.value)) &&
          (!endDate.value || orderDate <= new Date(endDate.value + 'T23:59:59'));

        if (!includeDate) return;

        order.items.forEach(item => {
          const product = allProducts.find(p => String(p.id) === String(item.productId));
          const price = product?.price ?? 0;

          temp.push({
            productName: item.productName,
            quantity: item.quantity,
            total: item.quantity * price,
            date: order.orderDate
          });
        });
      });

      rawSales.value = temp;
    };

    const filteredRows = computed(() => {
      return rawSales.value.filter(row =>
        (!filters.value.productName || row.productName.toLowerCase().includes(filters.value.productName.toLowerCase())) &&
        (!filters.value.quantity || String(row.quantity).includes(filters.value.quantity)) &&
        (!filters.value.total || String(row.total).includes(filters.value.total)) &&
        (!filters.value.date || formatDate(row.date).includes(filters.value.date))
      );
    });

    onBeforeMount(async () => {
      const username = sessionStorage.getItem("username");
      role.value = sessionStorage.getItem("role");

      await getOneWorker(username);
      const worker = stateWorker.workers?.data;
      selectedWarehouseId.value = worker?.warehouseId || '';

      if (role.value === "1") {
        showDropdown.value = true;
        await getAllWarehouse();
      }

      await Promise.all([getHistoryOrders(), getAllProductMainWarehouse()]);
      applyDateFilter();
    });

    return {
      rawSales,
      filteredRows,
      formatDate,
      startDate,
      endDate,
      filters,
      applyDateFilter,
      selectedWarehouseId,
      state,
      role,
      showDropdown
    };
  }
};
</script>




<style scoped>
th, td {
  vertical-align: middle !important;
}
</style>
