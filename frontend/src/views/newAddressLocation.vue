<template>
  <div>
    <navBarUser />

    <div class="container my-5">
      <h3 class="fw-bold mb-4">Isi Alamat Baru</h3>

      <div class="card shadow-sm border-0 rounded-4 p-4">
        <form @submit.prevent="submitNewAddress">
          <div class="mb-3">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" class="form-control" v-model="stateAddress.fullAddress" required />
          </div>

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

          <div class="mb-3">
            <label class="form-label">Kecamatan</label>
            <input type="text" class="form-control" v-model="stateAddress.district" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Kelurahan</label>
            <input type="text" class="form-control" v-model="stateAddress.subDistrict" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Kode Pos</label>
            <input type="number" class="form-control" v-model="stateAddress.postalCode" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Nama Penerima</label>
            <input type="text" class="form-control" v-model="stateAddress.recipientName" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Email Penerima</label>
            <input type="email" class="form-control" v-model="stateAddress.recipientEmail" required />
          </div>

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
import Swal from "sweetalert2";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "newAddressLocation",
  components: { navBarUser, vSelect },
  setup() {
    const router = useRouter();
    const { stateAddress, newAddress } = addressCRUD();
    const { stateCnP, getAllProvince, getAllCity } = cityAndProvinceCRUD();

    const cityLabel = (city) => {
      if (!city || !city.city_name || !city.type) return "";
      return `${city.type} ${city.city_name}`;
    };

    const submitNewAddress = async () => {
      const {
        fullAddress,
        province,
        city,
        district,
        subDistrict,
        postalCode,
        recipientName,
        recipientEmail,
        recipientPhone
      } = stateAddress;

      if (!fullAddress) {
        return Swal.fire("Gagal", "Alamat lengkap belum diisi.", "warning");
      }
      if (!province) {
        return Swal.fire("Gagal", "Provinsi belum dipilih.", "warning");
      }
      if (!city) {
        return Swal.fire("Gagal", "Kota belum dipilih.", "warning");
      }
      if (!district) {
        return Swal.fire("Gagal", "Kecamatan belum diisi.", "warning");
      }
      if (!subDistrict) {
        return Swal.fire("Gagal", "Kelurahan belum diisi.", "warning");
      }
      if (!postalCode) {
        return Swal.fire("Gagal", "Kode pos belum diisi.", "warning");
      }
      if (!recipientName) {
        return Swal.fire("Gagal", "Nama penerima belum diisi.", "warning");
      }
      if (!recipientEmail) {
        return Swal.fire("Gagal", "Email penerima belum diisi.", "warning");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipientEmail)) {
        return Swal.fire("Gagal", "Format email tidak valid.", "warning");
      }
      if (!recipientPhone) {
        return Swal.fire("Gagal", "Nomor telepon belum diisi.", "warning");
      }
      if (isNaN(recipientPhone)) {
        return Swal.fire("Gagal", "Nomor telepon harus berupa angka.", "warning");
      }

      try {
        await newAddress();
        await Swal.fire("Sukses", "Alamat berhasil disimpan.", "success");
        router.push("/addressLocation");
      } catch (err) {
        console.error("Error:", err);
        Swal.fire("Error", "Terjadi kesalahan saat menyimpan alamat.", "error");
      }
    };


    onBeforeMount(() => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      getAllProvince();
      getAllCity();
    });

    return {
      stateAddress,
      stateCnP,
      submitNewAddress,
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
