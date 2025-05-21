<template>
  <div>
    <navBarUser />
    <div class="container mt-4">
      <h3 class="mb-4 fw-bold">Daftar Transaksi</h3>

      <!-- Status Filter Buttons -->
      <div class="btn-group mb-4 d-flex flex-wrap" role="group">
        <button
          v-for="(label, index) in statusLabels"
          :key="index"
          type="button"
          class="btn me-2 mb-2"
          :class="selectedStatus === index - 1 ? 'btn-success' : 'btn-outline-success'"
          @click="selectedStatus = index - 1"
        >
          {{ label }}
        </button>
      </div>

      <!-- Orders -->
      <div class="row row-cols-1 g-3" v-if="filteredOrders.length > 0">
        <div v-for="item in filteredOrders" :key="item.id" class="col">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- Order Summary -->
              <h5 class="card-title">ID Order: {{ item.id }}</h5>
              <p class="mb-1"><strong>Status:</strong> {{ getStatusLabel(item.status) }}</p>
              <p class="mb-1"><strong>Total Bayar:</strong> Rp.{{ parseInt(item.totalPayment).toLocaleString('id') }}</p>
              <p class="mb-1"><strong>Jumlah Produk:</strong> {{ item.items.length }}</p>
              <p class="mb-3"><strong>Tanggal Order:</strong> {{ formatDate(item.orderDate) }}</p>

              <!-- Divider -->
              <hr />

              <!-- Product List -->
              <div class="ps-3 border-start border-2 border-success">
                <div v-for="prod in item.items" :key="prod.productId" class="mb-2">
                  <p class="mb-1">
                    <strong>Produk:</strong> {{ prod.productName }}
                    <span v-if="item.status === 5">
                      <template v-if="getReturnStatus(item.id, prod.productId) === 0">
                        <span class="badge bg-warning ms-2">Retur Diproses</span>
                      </template>
                      <template v-else-if="getReturnStatus(item.id, prod.productId) === 1">
                        <span class="badge bg-success ms-2">Retur Disetujui</span>
                      </template>
                      <template v-else-if="getReturnStatus(item.id, prod.productId) === 2">
                        <span class="badge bg-danger ms-2">Retur Ditolak</span>
                      </template>
                    </span>
                  </p>
                </div>

                <!-- Unified Return Button (only if at least one product is returnable) -->
                <div
                  v-if="
                    item.status === 5 &&
                    isReturnable(item.deliveredDate) &&
                    item.items.some(prod => getReturnStatus(item.id, prod.productId) === null)
                  "
                  class="mt-2"
                >
                  <router-link
                    :to="`/returnOrder/${item.id}`"
                    class="btn btn-outline-danger btn-sm"
                  >
                    <i class="bi bi-arrow-counterclockwise me-1"></i> Ajukan Pengembalian
                  </router-link>
                </div>
              </div>

              <!-- Divider -->
              <hr />

              <!-- Action Button (status 4 = delivered) -->
              <div v-if="item.status === 4" class="text-end mt-3">
                <button class="btn btn-sm btn-success" @click="markAsDone(item.id)">
                  Tandai Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-muted mt-5">
        <i class="bi bi-receipt fs-1"></i>
        <p>Belum ada transaksi</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import orderCRUD from "../modules/orderCRUD.js";
import returnCRUD from "../modules/returnCRUD.js";
import { ref, computed, onBeforeMount } from "vue";

export default {
  name: "historyTransaksi",
  components: {
    navBarUser
  },
  setup() {
    const { stateOrder, getAllOrderUser, updateOrder } = orderCRUD();
    const { stateReturn, fetchUserReturns } = returnCRUD();
    const selectedStatus = ref(-1);
    const username = sessionStorage.getItem("username");

    const statusLabels = [
      "Semua",
      "Menunggu Pembayaran",
      "Menunggu Konfirmasi",
      "Sedang Diproses",
      "Sedang Dikirim",
      "Sampai di Tujuan",
      "Selesai"
    ];

    const getStatusLabel = (status) => {
      return statusLabels[status + 1];
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    };

    const isReturnable = (deliveredDate) => {
      if (!deliveredDate) return false;
      const delivered = new Date(deliveredDate);
      const now = new Date();
      const diff = (now - delivered) / (1000 * 60 * 60 * 24);
      return diff <= 3;
    };

    const filteredOrders = computed(() => {
      if (!stateOrder.order.data) return [];
      if (selectedStatus.value === -1) return stateOrder.order.data;
      return stateOrder.order.data.filter(order => order.status === selectedStatus.value);
    });

    const getReturnStatus = (orderId, productId) => {
      const match = stateReturn.returnList.find(r =>
        r.orderId === orderId && r.productId === productId
      );
      return match ? match.status : null;
    };

    const markAsDone = async (orderId) => {
      await updateOrder(orderId, 5); // mark as selesai
      await getAllOrderUser(username); // refresh
    };

    onBeforeMount(async () => {
      await getAllOrderUser(username);
      await fetchUserReturns(username);
    });

    return {
      stateOrder,
      getAllOrderUser,
      selectedStatus,
      statusLabels,
      filteredOrders,
      getStatusLabel,
      formatDate,
      stateReturn,
      fetchUserReturns,
      getReturnStatus,
      isReturnable,
      markAsDone
    };
  }
};
</script>
