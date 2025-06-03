<template>
  <div>
    <navBarInventory />
    
    <div class="container mt-4" v-if="stateOrder.order && stateOrder.order.data">
      <div class="card shadow">
        <div class="card-body">
          <h3 class="card-title">Detail Order</h3>
          <h5 class="text-muted">Order ID: <strong>{{ stateOrder.order.data.id }}</strong></h5>
          <hr>
          
          <p><strong>Pembeli:</strong> {{ stateOrder.order.data.username }}</p>

          
          <div v-for="(item, index) in stateOrder.order.data.items" :key="index" class="mb-3 border-start ps-3 border-2">
            <p><strong>Product ID:</strong> {{ item.productId }}</p>
            <p><strong>Product Name:</strong> {{ item.productName }}</p>
            <p><strong>Quantity:</strong> {{ item.quantity }}</p>
          </div>

          <p><strong>Total Payment:</strong> Rp.{{ parseInt(stateOrder.order.data.totalPayment).toLocaleString('id') }}</p>

          <p>
            <strong>Delivery Method:</strong>
            <span v-if="stateOrder.order.data.deliveryMethod === 0">Pengambilan di Tempat</span>
            <span v-else>Delivery</span>
          </p>

          <!-- ✅ Delivery Details -->
          <div v-if="stateDelivery.delivery && stateOrder.order.data.deliveryMethod === 1">
            <h5 class="mt-4">Detail Pengiriman</h5>
            <p><strong>Alamat:</strong> {{ stateDelivery.delivery.fullAddress }}</p>
            <p><strong>Kelurahan:</strong> {{ stateDelivery.delivery.subDistrict }}</p>
            <p><strong>Kecamatan:</strong> {{ stateDelivery.delivery.district }}</p>
            <p><strong>Kota:</strong> {{ stateDelivery.delivery.city }}</p>
            <p><strong>Provinsi:</strong> {{ stateDelivery.delivery.province }}</p>
            <p><strong>Kode Pos:</strong> {{ stateDelivery.delivery.postalCode }}</p>
          </div>

          <p>
            <strong>Status:</strong>
            <span class="badge bg-secondary" v-if="stateOrder.order.data.status === 0">Menunggu Pembayaran</span>
            <span class="badge bg-warning text-dark" v-else-if="stateOrder.order.data.status === 1">Menunggu Konfirmasi</span>
            <span class="badge bg-primary" v-else-if="stateOrder.order.data.status === 2">Sedang Diproses</span>
            <span class="badge bg-info text-dark" v-else-if="stateOrder.order.data.status === 3">Sedang Dikirim</span>
            <span class="badge bg-success" v-else-if="stateOrder.order.data.status === 4">Sampai di Tujuan</span>
            <span class="badge bg-dark" v-else>Selesai</span>
          </p>

          <!-- Status Action Buttons -->
          <div class="mt-4">
            <button v-if="stateOrder.order.data.status === 1"
                    class="btn btn-warning me-2"
                    @click="handleStatusChange(2)">
              <i class="bi bi-check-circle me-1"></i> Konfirmasi Pesanan
            </button>

            <button v-if="stateOrder.order.data.status === 2"
                    class="btn btn-primary me-2"
                    @click="handleStatusChange(3)">
              <i class="bi bi-box-seam me-1"></i> Sedang Dikirim
            </button>

            <!-- Diterima oleh -->
            <div v-if="stateOrder.order.data.status === 3" class="mb-3">
              <label for="receivedBy" class="form-label"><strong>Diterima oleh:</strong></label>
              <input type="text"
                    v-model="receivedBy"
                    id="receivedBy"
                    class="form-control"
                    placeholder="Masukkan nama penerima" />
            </div>

            <button v-if="stateOrder.order.data.status === 3"
                    class="btn btn-info"
                    @click="handleConfirmDelivery">
              <i class="bi bi-geo-alt-fill me-1"></i> Sampai Tujuan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import orderCRUD from "../modules/orderCRUD.js";
import deliveryCRUD from "../modules/deliveryCRUD.js";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';
export default {
  name: "detailOrder",
  components: {
    navBarInventory,
  },
  setup() {
    const { stateOrder, getOneOrder, updateOrder } = orderCRUD();
    const { stateDelivery, getDeliveryByOrderId } = deliveryCRUD();
    const route = useRoute();
    const receivedBy = ref("");

    const handleConfirmDelivery = async () => {
      if (!receivedBy.value.trim()) {
        Swal.fire('Gagal', 'Mohon isi nama penerima terlebih dahulu.', 'error');
        return;
      }

      const confirm = await Swal.fire({
        title: 'Konfirmasi Pengiriman',
        text: `Pesanan akan ditandai sebagai "Sampai di Tujuan" dan diterima oleh ${receivedBy.value}. Lanjutkan?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, konfirmasi',
        cancelButtonText: 'Batal'
      });

      if (confirm.isConfirmed) {
        const updated = await updateOrder(stateOrder.order.data.id, 4, receivedBy.value);
        if (updated) {
          stateOrder.order.data = updated;
          Swal.fire('Berhasil', 'Status pesanan diperbarui.', 'success');
        } else {
          Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui status.', 'error');
        }
      }
    };

    const handleStatusChange = async (newStatus) => {
      const updated = await updateOrder(stateOrder.order.data.id, newStatus);
      if (updated) {
        stateOrder.order.data = updated;
      }
    };

    onBeforeMount(async () => {
      await getOneOrder(route.params.id);
      if (stateOrder.order?.data?.deliveryId) {
        await getDeliveryByOrderId(stateOrder.order.data.id);
      }
    });

    return {
      stateOrder,
      getOneOrder,
      updateOrder,
      receivedBy,
      handleConfirmDelivery,
      handleStatusChange,
      stateDelivery
    };
  },
};
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>
