<template>
  <div>
    <navBarUser />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Riwayat Pengembalian</h2>

      <div v-if="userReturns.length > 0" class="row row-cols-1 g-3">
        <div v-for="item in userReturns" :key="item._id" class="col">
          <div class="card p-3 shadow-sm">
            <div class="d-flex">
              <!-- Image Preview -->
              <img
                v-if="item.mediaUrl"
                :src="'https://bmp-inv-be.zenbytes.id' + item.mediaUrl"
                alt="Bukti Retur"
                class="me-3"
                style="width: 120px; height: auto; object-fit: contain;"
              />

              <!-- Info -->
              <div>
                <p class="mb-1"><strong>Order ID:</strong> {{ item.orderId }}</p>
                <p class="mb-1"><strong>Produk:</strong> {{ item.productName }}</p>
                <p class="mb-1"><strong>Alasan Pengembalian:</strong> {{ item.reason }}</p>
                <p class="mb-1"><strong>Tanggal Pengajuan:</strong> {{ formatDate(item.requestDate) }}</p>
                <p class="mb-1">
                  <strong>Status:</strong>
                  <span :class="statusClass(item.status)">
                    {{ statusLabel(item.status) }}
                  </span>
                </p>
                <p v-if="item.adminNote && item.status === 2" class="mb-0"><strong>Catatan Admin:</strong> {{ item.adminNote }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted mt-5">
        <i class="bi bi-arrow-counterclockwise fs-1"></i>
        <p>Belum ada permintaan pengembalian</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import returnCRUD from "@/modules/returnCRUD.js";
import { onMounted, computed } from "vue";

export default {
  name: "returnStatusUser",
  components: { navBarUser },
  setup() {
    const { stateReturn, fetchUserReturns } = returnCRUD();
    const username = sessionStorage.getItem("username");

    const userReturns = computed(() => stateReturn.returnList);

    const statusLabel = (status) => {
      if (status === 0) return "Diproses";
      if (status === 1) return "Disetujui";
      if (status === 2) return "Ditolak";
      return "-";
    };

    const statusClass = (status) => {
      if (status === 0) return "badge bg-warning";
      if (status === 1) return "badge bg-success";
      if (status === 2) return "badge bg-danger";
      return "badge bg-secondary";
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    onMounted(() => {
      fetchUserReturns(username);
    });

    return {
      userReturns,
      formatDate,
      statusLabel,
      statusClass,
    };
  },
};
</script>
