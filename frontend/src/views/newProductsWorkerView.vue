<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h3 class="fw-bold mb-4">Tambah Produk Baru</h3>

      <form @submit.prevent="newProduct">
        <div class="mb-3">
          <label class="form-label">Nama Produk</label>
          <input
            type="text"
            class="form-control"
            v-model="stateProduct.newNameP"
            placeholder="Contoh: Toto Bathub"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Stok</label>
          <input
            type="number"
            class="form-control"
            v-model="stateProduct.newStock"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Gudang</label>
          <select class="form-select" v-model="stateProduct.newWarehouse" required>
            <option disabled value="">Pilih gudang</option>
            <option v-for="item in state.warehouse" :key="item.id" :value="item.id">
              {{ item.warehouse }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Kategori</label>
          <select class="form-select" v-model="stateProduct.newCategory" required>
            <option disabled value="">Pilih kategori</option>
            <option v-for="item in statePC.productCategories" :key="item.id" :value="item.id">
              {{ item.categoriesName }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Harga</label>
          <input
            type="number"
            class="form-control"
            v-model="stateProduct.newPrice"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Deskripsi</label>
          <textarea
            class="form-control"
            rows="3"
            v-model="stateProduct.newDesc"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="stateProduct.newStatus" required>
            <option value="1">Aktif</option>
            <option value="2">Tidak Aktif</option>
          </select>
        </div>

        <button type="submit" class="btn btn-success">Simpan Produk</button>
      </form>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import {onMounted} from 'vue'
import productCRUD from '../modules/productCRUD.js'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
import warehouseCRUD from '../modules/warehouseCRUD.js'

export default {
    name:"newProduct",
    components:{
        navBarInventory,
    },
    setup(){
        const {stateProduct, newProduct} = productCRUD()
        const {statePC, getAllProductCategories} = productCategoriesCRUD()
        const {state, getAllWarehouse} = warehouseCRUD()

        onMounted(()=>{
            getAllProductCategories()
            getAllWarehouse()
        })

        return {statePC, getAllProductCategories, newProduct, stateProduct,state,getAllWarehouse}
    }
}
</script>
<style lang="">
    
</style>