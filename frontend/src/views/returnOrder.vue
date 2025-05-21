<template>
  <div>
    <navBarUser />
    <div class="container my-5" v-if="stateOrder.order?.data">
      <h3 class="fw-bold mb-4">Ajukan Pengembalian</h3>
      <div class="card p-4 shadow-sm">
        <p><strong>ID Order:</strong> {{ stateOrder.order.data.id }}</p>
        <p><strong>Tanggal Order:</strong> {{ formatDate(stateOrder.order.data.orderDate) }}</p>

        <!-- Product Selection -->
        <div class="mb-3">
          <label for="product" class="form-label"><strong>Pilih Produk:</strong></label>
          <select v-model="selectedProduct" id="product" class="form-select" required>
            <option disabled value="">-- Pilih Produk --</option>
            <option
              v-for="item in stateOrder.order.data.items"
              :key="item.productId"
              :value="item.productId"
            >
              {{ item.productName }}
            </option>
          </select>
        </div>

        <!-- Reason -->
        <div class="mb-3">
          <label for="reason" class="form-label"><strong>Alasan Pengembalian:</strong></label>
          <textarea
            id="reason"
            v-model="reason"
            rows="3"
            class="form-control"
            placeholder="Contoh: Produk rusak saat diterima"
          ></textarea>
        </div>

        <!-- File Upload -->
        <div class="mb-3">
          <label for="file" class="form-label"><strong>Bukti Foto/Video:</strong></label>
          <input
            type="file"
            class="form-control"
            id="file"
            @change="handleFileUpload"
            accept="image/*,video/*"
          />
        </div>

        <button class="btn btn-danger" @click="submitReturn">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Kirim Pengajuan
        </button>
      </div>
    </div>

    <div v-else class="text-center my-5 text-muted">
      <i class="bi bi-receipt fs-1"></i>
      <p>Sedang memuat data order...</p>
    </div>
  </div>
</template>


<script>
import navBarUser from "@/components/navBarUser.vue";
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import orderCRUD from "../modules/orderCRUD.js";
import returnCRUD from "../modules/returnCRUD.js";

export default {
  name: "returnRequest",
  components: {
    navBarUser,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orderId = route.params.id;
    console.log(orderId)
    const { stateOrder, getOneOrder } = orderCRUD();
    const { submitReturnRequest,stateReturn } = returnCRUD();

    const selectedProduct = ref("");
    const reason = ref("");
    const file = ref(null);

    const handleFileUpload = (e) => {
      file.value = e.target.files[0];
    };

    const submitReturn = async () => {
      if (!selectedProduct.value || !reason.value.trim() || !file.value) {
        alert("Semua kolom harus diisi.");
        return;
      }

      const success = await submitReturnRequest({
      order: stateReturn.order, // ✅ CORRECT
      productId: selectedProduct.value,
      reason: reason.value,
      file: file.value,
    });

      if (success) {
        alert("Pengajuan pengembalian berhasil dikirim!");
        router.push("/history");
      } else {
        alert("Terjadi kesalahan saat mengirim pengajuan.");
      }
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

   onBeforeMount(async () => {
      await getOneOrder(orderId);
      stateReturn.order = stateOrder.order.data; // ✅ sync once order is loaded
      console.log("✅ returnCRUD stateReturn.order:", stateReturn.order);
    });

    return {
      stateOrder,
      selectedProduct,
      stateReturn,
      reason,
      file,
      formatDate,
      handleFileUpload,
      submitReturn,
    };
  },
};
</script>
