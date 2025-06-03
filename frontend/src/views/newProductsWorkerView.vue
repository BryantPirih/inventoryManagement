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

        <button type="button" @click="validateAndSubmit" class="btn btn-success">Simpan Produk</button>
      </form>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue';
import { onMounted } from 'vue';
import productCRUD from '../modules/productCRUD.js';
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js';
import warehouseCRUD from '../modules/warehouseCRUD.js';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
  name: "newProduct",
  components: { navBarInventory },
  setup() {
    const { stateProduct, newProduct } = productCRUD();
    const { statePC, getAllProductCategories } = productCategoriesCRUD();
    const { state, getAllWarehouse } = warehouseCRUD();
    const router = useRouter();

    onMounted(() => {
      getAllProductCategories();
      getAllWarehouse();
    });

    const validateAndSubmit = async () => {
      const {
        newNameP,
        newStock,
        newWarehouse,
        newCategory,
        newPrice,
        newDesc,
        newStatus
      } = stateProduct;

      // Basic validation
      if (
        !newNameP ||
        !newStock ||
        newStock < 0 ||
        !newWarehouse ||
        !newCategory ||
        !newPrice ||
        newPrice < 0 ||
        !newDesc ||
        !newStatus
      ) {
        return Swal.fire({
          icon: 'warning',
          title: 'Validasi Gagal',
          text: 'Harap lengkapi semua data dengan benar.'
        });
      }

      try {
        const result = await newProduct(); // Assuming it returns the product object
        await Swal.fire({
          icon: 'success',
          title: 'Produk Ditambahkan',
          text: 'Silakan lanjutkan untuk mengunggah gambar produk.'
        });

        // Redirect to image upload
        router.push(`/uploadImageProductAdmin?id=${result.id}`);
      } catch (err) {
        console.error("Create product failed:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: 'Terjadi kesalahan saat menyimpan produk.'
        });
      }
    };

    return {
      statePC,
      state,
      stateProduct,
      getAllProductCategories,
      getAllWarehouse,
      validateAndSubmit
    };
  }
};
</script>

<style lang="">
    
</style>