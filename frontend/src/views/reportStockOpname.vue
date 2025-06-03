<template>
  <div>
    <navBarInventory />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">Laporan Stok Opname</h3>

      <!-- Bulan Filter -->
      <div class="row mb-3">
        <div class="col-md-3">
          <label>Filter Bulan</label>
          <select v-model="selectedMonthYear" class="form-control">
            <option value="">-- Semua Bulan --</option>
            <option v-for="option in monthYearOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="col-md-3 align-self-end">
          <button class="btn btn-primary w-100" @click="applyDateFilter">Terapkan Filter</button>
        </div>
      </div>

      <!-- Column Filters -->
      <div class="row mb-2">
        <div class="col-md-2"><input v-model="filters.productId" placeholder="Filter Produk" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.warehouseId" placeholder="Filter Gudang" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.updatedBy" placeholder="Filter Oleh" class="form-control" /></div>
        <div class="col-md-2"><input v-model="filters.reason" placeholder="Filter Alasan" class="form-control" /></div>
      </div>

      <!-- Table -->
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>ID Gudang</th>
            <th>Stok Lama</th>
            <th>Stok Baru</th>
            <th>Selisih</th>
            <th>Alasan</th>
            <th>Tanggal</th>
            <th>Diperbarui Oleh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log._id">
            <td>{{ log.productName || log.productId }}</td>
            <td>{{ log.warehouseId }}</td>
            <td>{{ log.oldStock }}</td>
            <td>{{ log.newStock }}</td>
            <td :class="{ 'text-danger': log.difference < 0, 'text-success': log.difference > 0 }">
              {{ log.difference }}
            </td>
            <td>{{ log.reason }}</td>
            <td>{{ formatDate(log.opnameDate) }}</td>
            <td>{{ log.updatedBy }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredLogs.length === 0" class="text-muted">
        Tidak ada data stok opname yang sesuai.
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import stockOpnameCRUD from '@/modules/stockOpnameCRUD.js';
import { onBeforeMount, ref, computed } from 'vue';

export default {
  name: 'stockOpnameReport',
  components: { navBarInventory },
  setup() {
    const { stateStockOpname, getAllOpnameLogs } = stockOpnameCRUD();

    const selectedMonthYear = ref('');
    const rawLogs = ref([]);
    const filters = ref({
      productId: '',
      warehouseId: '',
      updatedBy: '',
      reason: ''
    });

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('id-ID');
    };

    const applyDateFilter = () => {
      const logs = stateStockOpname.logs;
      const [year, month] = selectedMonthYear.value
        ? selectedMonthYear.value.split("-").map(Number)
        : [null, null];

      rawLogs.value = logs.filter(log => {
        const date = new Date(log.opnameDate);
        return !year || !month || (date.getFullYear() === year && date.getMonth() === month);
      });
    };

    const monthYearOptions = computed(() => {
      const uniqueMonths = new Set();
      stateStockOpname.logs.forEach((log) => {
        const date = new Date(log.opnameDate);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        uniqueMonths.add(key);
      });

      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                          "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      return Array.from(uniqueMonths).sort().reverse().map((key) => {
        const [year, month] = key.split("-");
        return {
          value: key,
          label: `${monthNames[parseInt(month)]} ${year}`
        };
      });
    });

    const filteredLogs = computed(() => {
      return rawLogs.value.filter(log =>
        (!filters.value.productId || (log.productName || '').toLowerCase().includes(filters.value.productId.toLowerCase())) &&
        (!filters.value.warehouseId || (log.warehouseId || '').toLowerCase().includes(filters.value.warehouseId.toLowerCase())) &&
        (!filters.value.updatedBy || (log.updatedBy || '').toLowerCase().includes(filters.value.updatedBy.toLowerCase())) &&
        (!filters.value.reason || (log.reason || '').toLowerCase().includes(filters.value.reason.toLowerCase()))
      );
    });

    onBeforeMount(async () => {
      await getAllOpnameLogs();
      applyDateFilter();
    });

    return {
      selectedMonthYear,
      monthYearOptions,
      filters,
      filteredLogs,
      formatDate,
      applyDateFilter
    };
  }
};
</script>

<style scoped>
th, td {
  vertical-align: middle !important;
}
</style>
