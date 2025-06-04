<template>
  <div>
    <navBarInventory />

    <div class="container py-4">
      <!-- Warehouse filter for Admin -->
      <div v-if="isAdmin" class="mb-3">
        <label for="warehouseSelect" class="form-label">Pilih Gudang:</label>
        <select id="warehouseSelect" v-model="selectedWarehouse" class="form-select">
          <option disabled value="">-- Pilih Gudang --</option>
          <option v-for="warehouse in allWarehouses" :key="warehouse.id" :value="warehouse.id">
            {{ warehouse.warehouse }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="fw-bold">Stock Opname</h3>
        <button @click="saveTable" :disabled="!allFilled" class="btn btn-success">Simpan</button>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Product ID</th>
              <th>Nama Produk</th>
              <th>Stok Lama</th>
              <th>Stok Baru</th>
              <th>Alasan</th>
              <th>Terakhir Diupdate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredProducts" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.stock }}</td>
              <td>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="item.newStock"
                  placeholder="Masukkan stok baru"
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="item.newReason"
                  placeholder="Masukkan alasan"
                />
              </td>
              <td>{{ new Date(item.lastUpdate).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import productCRUD from '../modules/productCRUD.js'
import warehouseCRUD from '../modules/warehouseCRUD.js'
import workerCRUD from '../modules/workerCRUD.js'
import { onMounted, computed, ref } from 'vue'
import Swal from 'sweetalert2'; // ⬅ add at the top

export default {
  name: "stockOpname",
  components: { navBarInventory },

  setup() {
    const { stateProduct, getAllProduct } = productCRUD()
    const { getAllWarehouse, state: stateWarehouse } = warehouseCRUD()
    const { stateWorker, getOneWorker } = workerCRUD()

    const selectedWarehouse = ref(null)
    const allWarehouses = ref([])

    const isAdmin = computed(() => sessionStorage.getItem('role') === '1')

    const allFilled = computed(() =>
      Array.isArray(filteredProducts.value) &&
      filteredProducts.value.length > 0 &&
      filteredProducts.value.every(p => p.newStock !== undefined && p.newStock !== null)
    )

    const filteredProducts = computed(() => {
      if (selectedWarehouse.value) {
        return stateProduct.product.filter(p => p.warehouseId === selectedWarehouse.value)
      }
      return []
    })

    const saveTable = async () => {
      try {
        const response = await fetch("https://bmp-inv-be.zenbytes.id/stockOpname/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: stateProduct.product,
            user: sessionStorage.getItem('username'),
          }),
        });

        if (!response.ok) throw new Error("Failed to save data");

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data stock opname berhasil disimpan.'
        });
      } catch (error) {
        console.error("Error saving table data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat menyimpan data.'
        });
      }
    };


    onMounted(async () => {
      const username = sessionStorage.getItem("username")

      await getAllProduct()
      await getAllWarehouse()
      await getOneWorker(username)

      // Assign warehouse list
      allWarehouses.value = Array.isArray(stateWarehouse.warehouse?.data)
        ? stateWarehouse.warehouse.data
        : Array.isArray(stateWarehouse.warehouse)
          ? stateWarehouse.warehouse
          : []

      const worker = stateWorker.workers?.data
      if (worker?.warehouseId) {
        selectedWarehouse.value = worker.warehouseId
      }

      // Admins can see dropdown + switch warehouses
      // But we default it to their assigned warehouse
    })

    return {
      stateProduct,
      saveTable,
      filteredProducts,
      isAdmin,
      selectedWarehouse,
      allFilled,
      allWarehouses
    }
  }
}
</script>



<style scoped>
/* Optional styling */
</style>
