<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h2 class="mb-4">Riwayat Penjualan (Selesai)</h2>
      <div class="mb-3">
        <div class="row g-2">
          <div class="col-6 col-md-6">
            <button class="btn btn-outline-success w-100" @click="selectedStatus = 4">
              Sampai di tujuan
            </button>
          </div>
          <div class="col-6 col-md-6">
            <button class="btn btn-outline-dark w-100" @click="selectedStatus = 5">
              Selesai
            </button>
          </div>
        </div>
      </div>

      <div v-if="stateOrder.order && stateOrder.order.length > 0">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>Tanggal Order</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredHistory" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.username }}</td>
                <td>{{ new Date(item.orderDate).toLocaleDateString('id-ID') }}</td>
                <td>Rp.{{ parseInt(item.totalPayment).toLocaleString('id') }}</td>
                <td>
                  <span class="badge bg-success">
                    {{ item.status === 4 ? "Sampai di tujuan" : "Selesai" }}
                  </span>
                </td>
                <td>
                  <router-link :to="'/order/' + item.id" class="btn btn-sm btn-secondary">
                    Detail
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center text-muted mt-5">
        <i class="bi bi-inbox" style="font-size: 2rem;"></i>
        <p class="mt-2">Tidak ada riwayat pesanan yang selesai.</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import orderCRUD from "../modules/orderCRUD.js";
import { ref, computed, onMounted } from "vue";
export default {
  name: "historySales",
  components: {
    navBarInventory
  },
  setup() {
    const { stateOrder, getHistoryOrders } = orderCRUD();
    const selectedStatus = ref(4);

    const filteredHistory = computed(() => {
      return stateOrder.order?.filter(order => order.status === selectedStatus.value) || [];
    });

    onMounted(() => {
      getHistoryOrders();
    });

    return {
      stateOrder,
      selectedStatus,
      filteredHistory
    };
  },
};
</script>
