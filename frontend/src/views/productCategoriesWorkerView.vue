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

export default {
    name:"productCategoriesWorkerView",
    components:{
        navBarInventory
    },
    setup(){
        const { statePC, getAllProductCategories, deleteProductCategory } = productCategoriesCRUD()
        const handleDelete = (id) => {
          if (confirm('Delete this category?')) {
            deleteProductCategory(id)
          }
        }
        onMounted(()=>{
            getAllProductCategories()
        })
        return { statePC, getAllProductCategories, deleteProductCategory,handleDelete }
    }
}
</script>
<style lang="">
    
</style>