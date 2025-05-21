<template>
  <div>
    <navBarInventory />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Daftar Permintaan Retur</h2>

      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>Username</th>
            <th>Tanggal Permintaan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(request, index) in requests" :key="request._id">
            <td>{{ index + 1 }}</td>
            <td>{{ request.orderId }}</td>
            <td>{{ request.productId }}</td>
            <td>{{ request.username }}</td>
            <td>{{ formatDate(request.requestDate) }}</td>
            <td>
              <span :class="statusClass(request.status)">
                {{ statusLabel(request.status) }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-primary btn-sm"
                @click="goToDetail(request._id)"
              >
                Lihat Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="requests.length === 0" class="mt-3">
        <p>Tidak ada permintaan retur.</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "returnRequestList",
  components: { navBarInventory },
  setup() {
    const router = useRouter();

    const goToDetail = (id) => {
      router.push(`/returnRequest/${id}`);
    };

    return { goToDetail };
  },
  data() {
    return {
      requests: [],
    };
  },
  methods: {
    async fetchRequests() {
      try {
        const res = await axios.get("http://localhost:3000/returnRequest");
        this.requests = res.data;
      } catch (err) {
        console.error("Error fetching return requests:", err);
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    statusLabel(status) {
      if (status === 1) return "Disetujui";
      if (status === 2) return "Ditolak";
      return "Menunggu";
    },
    statusClass(status) {
      if (status === 1) return "text-success fw-bold";
      if (status === 2) return "text-danger fw-bold";
      return "text-warning fw-bold";
    },
  },
  mounted() {
    this.fetchRequests();
  },
};
</script>
