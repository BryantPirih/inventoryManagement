<template>
  <div>
    <navBarUser />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">Isi Alamat Baru</h3>

      <div class="card shadow-sm border-0 rounded-4 p-4">
        <form @submit.prevent="newAddress">
          <!-- Alamat Lengkap -->
          <div class="mb-3">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" class="form-control" v-model="stateAddress.fullAddress" required />
          </div>

          <!-- Provinsi -->
          <div class="mb-3">
            <label class="form-label">Provinsi</label>
            <v-select
              v-model="stateAddress.province"
              :options="stateCnP.province"
              label="province"
              :reduce="prov => prov.province_id"
              placeholder="Pilih Provinsi"
            />
          </div>

          <!-- Kota -->
          <div class="mb-3">
            <label class="form-label">Kota</label>
            <v-select
              v-model="stateAddress.city"
              :options="stateCnP.city"
              :get-option-label="cityLabel"
              :reduce="city => city.city_id"
              placeholder="Pilih Kota"
            />
          </div>

          <!-- Kecamatan -->
          <div class="mb-3">
            <label class="form-label">Kecamatan</label>
            <input type="text" class="form-control" v-model="stateAddress.district" required />
          </div>

          <!-- Kelurahan -->
          <div class="mb-3">
            <label class="form-label">Kelurahan</label>
            <input type="text" class="form-control" v-model="stateAddress.subDistrict" required />
          </div>

          <!-- Kode Pos -->
          <div class="mb-3">
            <label class="form-label">Kode Pos</label>
            <input type="number" class="form-control" v-model="stateAddress.postalCode" required />
          </div>

          <!-- Nama Penerima -->
          <div class="mb-3">
            <label class="form-label">Nama Penerima</label>
            <input type="text" class="form-control" v-model="stateAddress.recipientName" required />
          </div>

          <!-- Email Penerima -->
          <div class="mb-3">
            <label class="form-label">Email Penerima</label>
            <input type="email" class="form-control" v-model="stateAddress.recipientEmail" required />
          </div>

          <!-- Nomor Telepon -->
          <div class="mb-4">
            <label class="form-label">Nomor Telepon Penerima</label>
            <input type="number" class="form-control" v-model="stateAddress.recipientPhone" required />
          </div>

          <button type="submit" class="btn btn-success rounded-pill px-4 fw-semibold">
            <i class="bi bi-check-circle me-1"></i> Simpan Alamat
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import addressCRUD from "../modules/addressCRUD";
import cityAndProvinceCRUD from "../modules/cityAndProvinceCRUD.js";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { onBeforeMount } from "vue";

export default {
  name: "newAddressLocation",
  components: {
    navBarUser,
    vSelect,
  },
  setup() {
    const { stateAddress, newAddress } = addressCRUD();
    const { stateCnP, getAllProvince, getAllCity } = cityAndProvinceCRUD();

    const cityLabel = (city) => {
      if (!city || !city.city_name || !city.type) return "";
      return `${city.type} ${city.city_name}`;
    };

    onBeforeMount(() => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      getAllProvince();
      getAllCity();
    });

    return {
      stateAddress,
      newAddress,
      stateCnP,
      getAllCity,
      getAllProvince,
      cityLabel,
    };
  },
};
</script>
<style scoped>
.v-select {
  min-height: 38px;
}
</style>