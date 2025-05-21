<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h2 class="mb-4">Riwayat Penjualan (Selesai)</h2>

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
              <tr v-for="item in stateOrder.order" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.username }}</td>
                <td>{{ new Date(item.orderDate).toLocaleDateString('id-ID') }}</td>
                <td>Rp.{{ parseInt(item.totalPayment).toLocaleString('id') }}</td>
                <td>
                  <span class="badge bg-success">
                    {{ item.status === 4 ? "Selesai" : "Diterima" }}
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
import { onMounted } from "vue";

export default {
  name: "historySales",
  components: {
    navBarInventory
  },
  setup() {
    const { stateOrder, getHistoryOrders } = orderCRUD();

    onMounted(() => {
      getHistoryOrders();
    });

    return { stateOrder };
  },
};
</script>
