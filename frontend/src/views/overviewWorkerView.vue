<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h2 class="mb-4">Active Sales Orders</h2>

        <div class="mb-3">
          <div class="row g-2">
            <div class="col">
              <button class="btn btn-outline-secondary w-100" @click="selectedStatus = null">
                Semua
              </button>
            </div>
            <div class="col">
              <button class="btn btn-outline-dark w-100" @click="selectedStatus = 0">
                Menunggu Pembayaran
              </button>
            </div>
            <div class="col">
              <button class="btn btn-outline-warning w-100" @click="selectedStatus = 1">
                Menunggu Konfirmasi
              </button>
            </div>
            <div class="col">
              <button class="btn btn-outline-primary w-100" @click="selectedStatus = 2">
                Sedang Diproses
              </button>
            </div>
            <div class="col">
              <button class="btn btn-outline-info w-100" @click="selectedStatus = 3">
                Sedang Dikirim
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
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredOrders" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.username }}</td>
                <td>{{ new Date(item.orderDate).toLocaleDateString('id-ID') }}</td>
                <td>Rp.{{ parseInt(item.totalPayment).toLocaleString('id') }}</td>
                <td>
                  <span
                    v-if="item.status === 0"
                    class="badge bg-secondary"
                  >Menunggu Pembayaran</span>

                  <span
                    v-else-if="item.status === 1"
                    class="badge bg-warning text-dark"
                  >Menunggu Konfirmasi</span>

                  <span
                    v-else-if="item.status === 2"
                    class="badge bg-primary"
                  >Sedang Diproses</span>

                  <span
                    v-else-if="item.status === 3"
                    class="badge bg-info text-dark"
                  >Sedang Dikirim</span>
                </td>

                <td>
                  <router-link :to="'/order/' + item.id" class="btn btn-sm btn-primary">
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
        <p class="mt-2">No active orders found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import orderCRUD from "../modules/orderCRUD.js";
import { ref, computed, onMounted } from "vue";

export default {
  name: 'overviewWorker',
  components: {
    navBarInventory,
  },
  setup() {
    const { stateOrder, getAllOrder } = orderCRUD();

    const selectedStatus = ref(null);

    const filteredOrders = computed(() => {
      if (selectedStatus.value === null) return stateOrder.order;
      return stateOrder.order.filter(o => o.status === selectedStatus.value);
    });

    onMounted(() => {
      getAllOrder();
    });

    return {
      stateOrder,
      getAllOrder,
      selectedStatus,
      filteredOrders,
    };
  },
}
</script>
