<template>
  <div>
    <div :class="['card', 'shadow-sm', 'mb-3', bgClass(item.status)]">
      <div class="card-body">
        <h5 class="card-title text-dark">Order ID: {{ item.id }}</h5>
        <p :class="['card-text', textClass(item.status)]">
          Status: {{ statusText(item.status) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cardProduct",
  props: ['item'],
  methods: {
    statusText(status) {
      switch (status) {
        case 0: return 'Menunggu Pembayaran';
        case 1: return 'Menunggu Konfirmasi';
        case 2: return 'Sedang Diproses';
        case 3: return 'Sedang Diantar';
        case 4: return 'Sampai Ditujuan';
        default: return 'Telah Diterima';
      }
    },
    bgClass(status) {
      switch (status) {
        case 0: return 'bg-light';
        case 1: return 'bg-warning-subtle';
        case 2: return 'bg-warning';
        case 3: return 'bg-info-subtle';
        case 4: return 'bg-success-subtle';
        default: return 'bg-success';
      }
    },
    textClass(status) {
      switch (status) {
        case 0: return 'text-secondary';
        case 1: return 'text-warning';
        case 2: return 'text-warning-emphasis';
        case 3: return 'text-info';
        case 4: return 'text-success';
        default: return 'text-success-emphasis';
      }
    }
  }
}
</script>