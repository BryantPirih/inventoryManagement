<template>
  <div>
    <navBarInventory />
    <div class="container my-5">
      <h3 class="fw-bold mb-4">Laporan Perpindahan Barang</h3>

      <!-- Filter by date -->
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
          <button class="btn btn-primary w-100" @click="applyFilters">Terapkan Filter</button>
        </div>
      </div>

      <!-- Column Filters -->
      <div class="row mb-3">
        <div class="col-md-2">
          <input v-model="filters.from" class="form-control" placeholder="Filter Dari Gudang" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.to" class="form-control" placeholder="Filter Ke Gudang" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.productId" class="form-control" placeholder="Filter Produk" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.quantity" class="form-control" placeholder="Filter Jumlah" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.unitPrice" class="form-control" placeholder="Filter Harga" />
        </div>
        <div class="col-md-2">
          <input v-model="filters.total" class="form-control" placeholder="Filter Total" />
        </div>
      </div>

      <!-- Move Report Table -->
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Dari Gudang</th>
            <th>Ke Gudang</th>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total</th>
            <th>Tanggal Finalisasi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredFlattenedRows" :key="row._id">
            <td>{{ row.from }}</td>
            <td>{{ row.to }}</td>
            <td>{{ row.productId }}</td>
            <td>{{ row.quantity }}</td>
            <td>Rp.{{ parseInt(row.unitPrice).toLocaleString('id') }}</td>
            <td>Rp.{{ parseInt(row.total).toLocaleString('id') }}</td>
            <td>{{ formatDate(row.finalizedAt) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredFlattenedRows.length === 0" class="text-muted">
        Tidak ada data perpindahan untuk filter yang dipilih.
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import navBarInventory from '@/components/NavBarInventory.vue';
import moveCRUD from '@/modules/moveCRUD.js';
import moveProductCRUD from '@/modules/moveProductCRUD.js';

export default {
  name: 'moveHistoryReport',
  components: { navBarInventory },
  setup() {
    const { stateMove, getAllMove } = moveCRUD();
    const { stateMoveProduct, getMoveProduct } = moveProductCRUD();

    const startDate = ref('');
    const endDate = ref('');
    const flattenedRows = ref([]);

    const filters = ref({
      from: '',
      to: '',
      productId: '',
      quantity: '',
      unitPrice: '',
      total: '',
    });

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID');
    };

    const filterByDate = () => {
      const filtered = stateMove.move.filter((m) => {
        if (m.status !== 4 || !m.finalizedAt) return false;

        if (!startDate.value || !endDate.value) return true;

        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59, 999);
        const finalized = new Date(m.finalizedAt);
        return finalized >= start && finalized <= end;
      });

      return filtered;
    };

    const buildFlattenedRows = async () => {
      flattenedRows.value = [];
      const filteredMoves = filterByDate();

      for (const move of filteredMoves) {
        await getMoveProduct(move.id);
        const products = stateMoveProduct.moveProducts.data?.products || [];

        const rows = products.map((p, index) => ({
          _id: `${move.id}-${index}`,
          from: move.from,
          to: move.to,
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          total: p.total,
          finalizedAt: move.finalizedAt,
        }));

        flattenedRows.value.push(...rows);
      }
    };

    const filteredFlattenedRows = computed(() => {
      return flattenedRows.value.filter((row) => {
        return (
          (!filters.value.from || row.from.includes(filters.value.from)) &&
          (!filters.value.to || row.to.includes(filters.value.to)) &&
          (!filters.value.productId || row.productId.includes(filters.value.productId)) &&
          (!filters.value.quantity || row.quantity.toString().includes(filters.value.quantity)) &&
          (!filters.value.unitPrice || row.unitPrice.toString().includes(filters.value.unitPrice)) &&
          (!filters.value.total || row.total.toString().includes(filters.value.total))
        );
      });
    });

    const applyFilters = async () => {
      await buildFlattenedRows();
    };

    onMounted(async () => {
      await getAllMove();
      await buildFlattenedRows();
    });

    return {
      startDate,
      endDate,
      flattenedRows,
      formatDate,
      filterByDate,
      filters,
      applyFilters,
      filteredFlattenedRows,
    };
  },
};
</script>

<style scoped>
th,
td {
  vertical-align: middle !important;
}
</style>