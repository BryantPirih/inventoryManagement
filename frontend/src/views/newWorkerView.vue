<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h3 class="fw-bold mb-4">Add New Worker</h3>

      <form @submit.prevent="handleNewWorker">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            class="form-control"
            required
            v-model="stateWorker.newUsername"
            autocomplete="username"
          />
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            required
            v-model="stateWorker.newName"
            autocomplete="name"
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            required
            v-model="stateWorker.newEmail"
            autocomplete="email"
          />
        </div>

        <div class="mb-3">
          <label for="role" class="form-label">Role</label>
          <select
            id="role"
            class="form-select"
            required
            v-model="stateWorker.newRole"
          >
            <option value="" disabled>Select a role</option>
            <option value="1">Admin</option>
            <option value="2">Manager</option>
            <option value="3">Karyawan</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="mobile" class="form-label">Mobile Phone</label>
          <input
            type="tel"
            id="mobile"
            class="form-control"
            required
            v-model="stateWorker.newMobilephone"
            autocomplete="tel"
          />
        </div>

        <div class="mb-3">
          <label for="warehouse" class="form-label">Warehouse</label>
          <select
            id="warehouse"
            class="form-select"
            required
            v-model="stateWorker.newWarehouseId"
          >
            <option value="" disabled>Select a warehouse</option>
            <option v-for="item in state.warehouse" :key="item.id" :value="item.id">
              {{ item.warehouse }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            required
            v-model="stateWorker.newPassword"
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import {onMounted} from 'vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'
import workerCRUD from '../modules/workerCRUD.js'
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
    name:"newWorker",
    components:{
        navBarInventory,
    },
    setup(){
        const {state, getAllWarehouse} = warehouseCRUD()
        const {stateWorker, newWorker} = workerCRUD()

        const router = useRouter();

        const handleNewWorker = async () => {
          const {
            newUsername,
            newName,
            newEmail,
            newRole,
            newMobilephone,
            newWarehouseId,
            newPassword
          } = stateWorker;

          // Basic field validation
          if (
            !newUsername ||
            !newName ||
            !newEmail ||
            !newRole ||
            !newMobilephone ||
            !newWarehouseId ||
            !newPassword
          ) {
            return Swal.fire({
              icon: 'warning',
              title: 'Validasi Gagal',
              text: 'Semua field wajib diisi.'
            });
          }

          // Email format validation
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(newEmail)) {
            return Swal.fire({
              icon: 'warning',
              title: 'Email Tidak Valid',
              text: 'Masukkan email dengan format yang benar.'
            });
          }

          try {
            await newWorker(); // original backend call
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Pekerja baru berhasil ditambahkan.'
            }).then(() => {
              router.push('/worker');
            });
          } catch (err) {
            console.error("Error creating worker:", err);
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: 'Terjadi kesalahan saat membuat pekerja.'
            });
          }
        };

        onMounted(()=>{
            getAllWarehouse()
        })

        return {state, getAllWarehouse, newWorker, stateWorker,handleNewWorker}
    }
}
</script>
<style lang="">
    
</style>