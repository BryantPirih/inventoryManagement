<template>
  <div>
    <navBarUser />

    <div class="container my-5">

      <h3 class="fw-bold mb-4">Edit Alamat</h3>
        {{stateAddress}}
      <div class="card shadow-sm border-0 rounded-4 p-4">
        <form @submit.prevent="submitEdit">
          <div class="mb-3">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" class="form-control" v-model="stateAddress.fullAddress" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Provinsi</label>
            <v-select
            v-model="selectedProvince"
            :options="stateCnP.province"
            label="province"
            placeholder="Pilih Provinsi"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Kota</label>
            <v-select
            v-model="selectedCity"
            :options="stateCnP.city"
            :get-option-label="cityLabel"
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
            <i class="bi bi-check-circle me-1"></i> Simpan Perubahan
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
import { ref, onBeforeMount, watchEffect, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "editAddressLocation",
  components: { navBarUser, vSelect },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { stateAddress, editAddress, getAddressById } = addressCRUD();
    const { stateCnP, getAllProvince, getAllCity } = cityAndProvinceCRUD();
    const selectedProvince = ref(null);
    const selectedCity = ref(null);

    const cityLabel = (city) => {
      if (!city || !city.city_name || !city.type) return "";
      return `${city.type} ${city.city_name}`;
    };

    const submitEdit = async () => {
      await editAddress(route.params.id, {
        username: stateAddress.newUsername,
        fullAddress: stateAddress.fullAddress,
        provinceID: selectedProvince.value?.province_id,
        cityID: selectedCity.value?.city_id,
        district: stateAddress.district,
        subDistrict: stateAddress.subDistrict,
        postalCode: stateAddress.postalCode,
        recipientName: stateAddress.recipientName,
        recipientEmail: stateAddress.recipientEmail,
        recipientPhone: stateAddress.recipientPhone
      });
      router.push("/addressLocation");
    };

    onBeforeMount(async () => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      await Promise.all([
        getAllProvince(),
        getAllCity(),
        getAddressById(route.params.id)
      ]);
    });

    watchEffect(() => {
      selectedProvince.value =
        stateCnP.province.find(
          (p) => p.province_id == stateAddress.province || p.province_id == stateAddress.provinceID
        ) || null;

      selectedCity.value =
        stateCnP.city.find(
          (c) => c.city_id == stateAddress.city || c.city_id == stateAddress.cityID
        ) || null;
    });

    watch(selectedProvince, (val) => {
      if (val) stateAddress.provinceID = val.province_id;
    });

    watch(selectedCity, (val) => {
      if (val) stateAddress.cityID = val.city_id;
    });

    return {
      stateAddress,
      submitEdit,
      stateCnP,
      getAddressById,
      selectedProvince,
      selectedCity,
      cityLabel
    };
  },
};
</script>


<style scoped>
.v-select {
  min-height: 38px;
}
</style>
