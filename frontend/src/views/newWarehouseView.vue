<template>
  <div>
    <navBarInventory />
    <div class="container mt-4">
      <h5 class="mb-4">Create New Warehouse</h5>
      <form @submit.prevent="validateAndSubmit">
        <div class="mb-3">
          <label for="warehouse" class="form-label">Warehouse Name</label>
          <input
            type="text"
            id="warehouse"
            name="warehouse"
            class="form-control"
            required
            v-model="state.newWRHS"
          />
        </div>

        <!-- Province Dropdown -->
        <div class="mb-3">
          <label class="form-label">Province</label>
          <v-select
            v-model="state.newProvince"
            :options="stateCnP.province"
            label="province"
            :reduce="prov => prov.province_id"
            placeholder="Select Province"
          />
        </div>

        <!-- City Dropdown -->
        <div class="mb-3">
          <label class="form-label">City</label>
          <v-select
            v-model="state.newCity"
            :options="stateCnP.city"
            :get-option-label="cityLabel"
            :reduce="city => city.city_id"
            placeholder="Select City"
          />
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Full Address</label>
          <input
            type="text"
            id="address"
            name="address"
            class="form-control"
            required
            v-model="state.newAddress"
          />
        </div>
        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'
import cityAndProvinceCRUD from "../modules/cityAndProvinceCRUD.js";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { onBeforeMount } from "vue";
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
export default {
  name: "newWarehouse",
  components: {
    navBarInventory,
    vSelect
  },
setup() {
    const { state, newWarehouse } = warehouseCRUD();
    const { stateCnP, getAllProvince, getAllCity } = cityAndProvinceCRUD();
    const router = useRouter();

    const cityLabel = (city) => {
      if (!city || !city.city_name || !city.type) return '';
      return `${city.type} ${city.city_name}`;
    };

        const validateAndSubmit = async () => {
      if (!state.newWRHS || !state.newProvince || !state.newCity || !state.newAddress) {
        Swal.fire({
          icon: 'warning',
          title: 'Gagal',
          text: 'Semua field wajib diisi!'
        });
        return;
      }

      try {
        await newWarehouse();
        Swal.fire({
          icon: 'success',
          title: 'Sukses',
          text: 'Warehouse berhasil ditambahkan!',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/warehouse');
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat menambahkan warehouse.'
        });
      }
    };


    onBeforeMount(() => {
      getAllCity();
      getAllProvince();
    });

    return {
      state,
      stateCnP,
      getAllCity,
      getAllProvince,
      cityLabel,
      validateAndSubmit
    };
  }
}
</script>

<style scoped>
/* Add spacing if needed */
</style>
