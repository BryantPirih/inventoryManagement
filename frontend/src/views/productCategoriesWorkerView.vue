<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Product Categories</h5>
        <router-link to="/newProductCategories" class="btn btn-success">New</router-link>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Category Name</th>
            <th scope="col">Unit</th>
            <th scope="col">Unit Conversion</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in statePC.productCategories" :key="item.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.categoriesName }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.unitConversion || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-danger"
                @click="handleDelete(item.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: "productCategoriesWorkerView",
  components: {
    navBarInventory
  },
  setup() {
    const { statePC, getAllProductCategories, deleteProductCategory } = productCategoriesCRUD()

    const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Kategori ini akan dihapus permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        try {
          await deleteProductCategory(id)
          Swal.fire({
            icon: 'success',
            title: 'Terhapus',
            text: 'Kategori berhasil dihapus.'
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan saat menghapus kategori.'
          })
        }
      }
    }

    onMounted(() => {
      getAllProductCategories()
    })

    return {
      statePC,
      getAllProductCategories,
      deleteProductCategory,
      handleDelete
    }
  }
}
</script>

<style lang="">
    
</style>