<template>
  <div>
    <navBarInventory />

    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Discount</h4>
        <router-link to="/newDiscount" class="btn btn-success">New</router-link>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col" class="text-center">No</th>
              <th scope="col">Name</th>
              <th scope="col">Code</th>
              <th scope="col" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in stateDiscount.discount" :key="item.discountCode">
              <th scope="row" class="text-center">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.discountCode }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger" @click="handleDelete(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import discountCRUD from '../modules/discountCRUD.js'
import { onBeforeMount } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: "discountOverview",
  components: { navBarInventory },
  setup() {
    const { stateDiscount, getAllDiscount, deleteDiscount } = discountCRUD()

    const handleDelete = (id) => {
      Swal.fire({
        title: 'Hapus diskon ini?',
        text: 'Diskon tidak dapat dikembalikan setelah dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDiscount(id).then(() => {
            Swal.fire('Berhasil', 'Diskon telah dihapus.', 'success');
          }).catch(() => {
            Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error');
          });
        }
      });
    }

    onBeforeMount(() => {
      getAllDiscount()
    })

    return { stateDiscount, handleDelete }
  }
}

</script>

<style scoped>
.container {
  max-width: 960px;
}
</style>
