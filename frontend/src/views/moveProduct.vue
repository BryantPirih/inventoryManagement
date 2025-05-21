<template>
  <div>
    <navBarInventory />
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">Daftar Permintaan Perpindahan Stok</h4>
        <router-link to="/newMove" class="btn btn-success">
          <i class="bi bi-plus-lg me-1"></i> Request
        </router-link>
      </div>

      <div v-if="stateMove.move.length > 0">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Dari</th>
              <th>Tujuan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in stateMove.move" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.from || '-' }}</td>
              <td>{{ item.to || '-' }}</td>
              <td>
                <span
                  :class="{
                    'text-warning fw-bold': item.status === 0,
                    'text-success fw-bold': item.status === 1,
                  }"
                >
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td>
                <router-link
                  :to="`/move/${item.id}`"
                  class="btn btn-outline-primary btn-sm"
                >
                  Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-muted">
        Tidak ada permintaan perpindahan stok.
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import moveCRUD from "../modules/moveCRUD.js";
import { onBeforeMount } from "vue";

export default {
  name: "moveProduct",
  components: {
    navBarInventory,
  },
  setup() {
    const { stateMove, getMoveByUsernameWarehouse } = moveCRUD();

    const username = sessionStorage.getItem("username");

    const getStatusText = (status) => {
      if (status === 0) return "Menunggu Approval";
      else if (status === 1) return "Approved";
      else if (status === 2) return "Dikirim";
      return "Telah Diterima";
    };

    onBeforeMount(() => {
      getMoveByUsernameWarehouse(username);
    });

    return {
      stateMove,
      getMoveByUsernameWarehouse,
      getStatusText,
    };
  },
};
</script>

