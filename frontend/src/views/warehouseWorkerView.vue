<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Warehouse</h5>
        <router-link to="/newWarehouse" class="btn btn-success">
          New
        </router-link>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Warehouse</th>
            <th scope="col">Address</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in state.warehouse" :key="item.warehouse">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.warehouse }}</td>
            <td>{{ item.address }}</td>
            <td>
              <!-- Replace this with your delete function later -->
              <button class="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import { onMounted } from 'vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'

export default {
  name: "warehouseWorker",
  components: {
    navBarInventory
  },
  setup() {
    const { state, getAllWarehouse } = warehouseCRUD()

    onMounted(() => {
      getAllWarehouse()
    })

    return { state, getAllWarehouse }
  }
}
</script>
