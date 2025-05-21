<template>
  <div>
    <navBarInventory />

    <div class="d-flex align-items-center justify-content-between my-3 mx-4">
      <h4>Worker</h4>
      <router-link
        to="/newWorker"
        class="nav-link"
        v-if="isAllowedToAdd"
        >
        <button class="btn btn-success">New</button>
        </router-link>

        <!-- Disabled version without routing -->
        <button
        class="btn btn-success disabled"
        disabled
        v-else
        >
        New
        </button>
    </div>

    <div class="table-responsive px-4">
      <table class="table table-striped table-bordered">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile phone</th>
            <th>Role</th>
            <th>Warehouse/Toko</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stateWorker.workers" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.mobilePhone }}</td>
            <td>{{ getRoleName(item.role) }}</td>
            <td>{{ item.warehouseId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import workerCRUD from '../modules/workerCRUD.js';
import { onMounted, computed } from 'vue';

export default {
  name: "workerView",
  components: {
    navBarInventory
  },
  setup() {
    const { stateWorker, getAllWorker } = workerCRUD();

    const currentUserRole = parseInt(sessionStorage.getItem("role")); 

    const isAllowedToAdd = computed(() => {
      // Only Admins (role 1) can add new workers
      return currentUserRole === 1;
    });

    const getRoleName = (role) => {
      if (role === 1) return 'Admin';
      if (role === 2) return 'Manager';
      return 'Karyawan';
    };

    onMounted(() => {
      getAllWorker();
    });

    return {
      stateWorker,
      getAllWorker,
      isAllowedToAdd,
      getRoleName
    };
  }
};
</script>
<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>