<template>
  <div>
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <h5 class="card-title text-primary">
          Belanja {{ formatDate(item.orderDate) }}
        </h5>

        <p class="card-text">
          <span class="badge bg-secondary">Status: {{ getStatusText(item.status) }}</span>
        </p>

        <p class="card-text fw-semibold">{{ item.productName }}</p>
        <p class="card-text">
          {{ item.quantity }} barang • Total belanja Rp. {{ formatCurrency(item.totalPayment) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cardOrder",
  props: ['item'],
  methods: {
    formatDate(isoDateStr) {
      const date = new Date(isoDateStr);
      return date.toISOString().split('T')[0];
    },
    formatCurrency(value) {
      return parseInt(value).toLocaleString("id-ID");
    },
    getStatusText(status) {
      const statusMap = {
        0: "menunggu pembayaran",
        1: "menunggu konfirmasi",
        2: "sedang diproses",
        3: "sedang dikirim",
        4: "sampai ditujuan",
        5: "telah diterima"
      };
      return statusMap[status] || "status tidak diketahui";
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 1.1rem;
}
</style>
