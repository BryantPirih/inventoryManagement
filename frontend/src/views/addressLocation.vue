<template>
  <div>
    <navBarUser />
    <div class="container my-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold">Alamat Pengiriman</h3>
        <router-link to="/newAddressLocation">
          <button class="btn btn-success rounded-pill">
            <i class="bi bi-plus-circle me-1"></i> Tambah Alamat
          </button>
        </router-link>
      </div>

      <!-- Fix here: directly use stateAddress.address instead of stateAddress.address.data -->
      <div v-if="stateAddress.address.length">
        <div
          class="card shadow-sm border-0 mb-3 p-4 rounded-4"
          v-for="item in stateAddress.address"
          :key="item._id"
        >
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="fw-semibold mb-1">{{ item.recipientName }}</h5>
              <div class="text-muted mb-1">+62{{ item.recipientPhone }}</div>
              <div class="text-dark">
                {{ item.fullAddress }}, {{ item.subDistrict }}, Kec. {{ item.district }},
                {{ item.city }}, {{ item.province }}, {{ item.postalCode }}, Indonesia
              </div>
            </div>
            <div v-if="item.isDefault === 0">
              <span class="badge bg-success">Default</span>
            </div>
          </div>

          <!-- Show button if not default -->
          <div v-if="item.isDefault !== 0" class="mt-3">
            <button
              class="btn btn-outline-primary btn-sm rounded-pill"
              @click="setDefaultAddress(item._id)"
            >
              Jadikan Default
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted py-5">
        <i class="bi bi-geo-alt fs-1 mb-3"></i>
        <p>Belum ada data alamat</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import addressCRUD from "../modules/addressCRUD.js";
import { onMounted } from "vue";

export default {
  name: "addressLocation",
  components: {
    navBarUser,
  },
  setup() {
    const { stateAddress, getAllAddress, updateAddress } = addressCRUD();

    onMounted(() => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      getAllAddress(stateAddress.newUsername);
    });

    const setDefaultAddress = async (selectedId) => {
      const username = stateAddress.newUsername;

      for (const item of stateAddress.address) {
        const isDefault = item._id === selectedId ? 0 : 1;
        await updateAddress(item._id, { isDefault });
      }
      await getAllAddress(username);
    };

    return {
      stateAddress,
      getAllAddress,
      setDefaultAddress,
    };
  },
};
</script>

<style scoped>
.badge.bg-success {
  font-size: 0.8rem;
  padding: 6px 12px;
}
</style>
