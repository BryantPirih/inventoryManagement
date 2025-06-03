<template>
  <div>
    <navBarInventory />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Detail Permintaan Retur</h2>

      <div v-if="request">
        <div class="card p-4 shadow-sm">
          <div class="d-flex flex-column flex-md-row">
            <img
              v-if="request.mediaUrl"
              :src="'https://bmp-inv-be.zenbytes.id' + request.mediaUrl"
              alt="Bukti Retur"
              class="me-4 mb-3 mb-md-0"
              style="width: 200px; object-fit: contain;"
            />

            <div>
              <p><strong>Order ID:</strong> {{ request.orderId }}</p>
              <p><strong>Product Name:</strong> {{ request.productName }}</p>
              <p><strong>Username:</strong> {{ request.username }}</p>
              <p><strong>Alasan dari User:</strong> {{ request.reason }}</p>
              <p><strong>Tanggal Permintaan:</strong> {{ formatDate(request.requestDate) }}</p>
              <p>
                <strong>Status Saat Ini:</strong>
                <span :class="statusClass(request.status)">
                  {{ statusLabel(request.status) }}
                </span>
              </p>

              <div v-if="request.status === 0" class="mt-3">
                <div class="mb-3">
                  <label for="note" class="form-label">Catatan Admin (opsional):</label>
                  <textarea
                    id="note"
                    class="form-control"
                    rows="3"
                    v-model="adminNote"
                    placeholder="Contoh: Tolak karena tidak sesuai syarat retur"
                  />
                </div>
                <button class="btn btn-success me-2" @click="updateStatus(1)">Setujui</button>
                <button class="btn btn-danger" @click="updateStatus(2)">Tolak</button>
              </div>

              <div v-else class="mt-3">
                <p><strong>Catatan Admin:</strong> {{ request.adminNote || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Memuat data...</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import returnCRUD from "@/modules/returnCRUD.js";

export default {
  name: "detailReturnRequest",
  components: { navBarInventory },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const request = ref(null);
    const adminNote = ref("");

    const { getReturnRequestById, updateReturnRequestStatus } = returnCRUD();

    const fetchRequest = async () => {
      const res = await getReturnRequestById(route.params.id);
      if (res) {
        request.value = res;
        adminNote.value = res.adminNote || "";
      }
    };

    const updateStatus = async (status) => {
      const result = await updateReturnRequestStatus(route.params.id, {
        status,
        adminNote: adminNote.value,
      });
      if (result) {
        alert("Status berhasil diperbarui.");
        router.push("/returnRequestList");
      }
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const statusLabel = (status) => {
      if (status === 1) return "Disetujui";
      if (status === 2) return "Ditolak";
      return "Menunggu";
    };

    const statusClass = (status) => {
      if (status === 1) return "text-success fw-bold";
      if (status === 2) return "text-danger fw-bold";
      return "text-warning fw-bold";
    };

    onMounted(fetchRequest);

    return {
      request,
      adminNote,
      updateStatus,
      formatDate,
      statusLabel,
      statusClass,
    };
  },
};
</script>
