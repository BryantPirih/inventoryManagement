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

          <div class="mt-3 d-flex gap-2 flex-wrap">
            <button
              v-if="item.isDefault !== 0"
              class="btn btn-outline-primary btn-sm rounded-pill"
              @click="setDefaultAddress(item._id)"
            >
              Jadikan Default
            </button>

            <router-link :to="`/editAddress/${item.id}`">
              <button class="btn btn-outline-secondary btn-sm rounded-pill">
                <i class="bi bi-pencil"></i> Edit
              </button>
            </router-link>

            <button
              class="btn btn-outline-danger btn-sm rounded-pill"
              @click="deleteHandler(item.id)"
            >
              <i class="bi bi-trash"></i> Hapus
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
import Swal from 'sweetalert2';

export default {
  name: "addressLocation",
  components: {
    navBarUser,
  },
  setup() {
    const { stateAddress, getAllAddress, updateAddress, deleteAddress } = addressCRUD();


    onMounted(() => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      getAllAddress(stateAddress.newUsername);
    });

    const deleteHandler = async (id) => {
      const result = await Swal.fire({
        title: 'Hapus alamat ini?',
        text: 'Tindakan ini tidak dapat dibatalkan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
      });

      if (result.isConfirmed) {
        await deleteAddress(id);
        await getAllAddress(stateAddress.newUsername);

        Swal.fire({
          icon: 'success',
          title: 'Alamat dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      }
    };


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
      deleteHandler
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
