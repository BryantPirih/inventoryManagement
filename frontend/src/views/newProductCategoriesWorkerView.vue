<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h3 class="fw-bold mb-4">Create Product Category</h3>

      <form @submit.prevent="validateAndSubmit">
        <div class="mb-3">
          <label class="form-label">Category Name</label>
          <input type="text" class="form-control" required v-model="statePC.newCn" />
        </div>

        <div class="mb-3">
          <label class="form-label">Unit</label>
          <input type="text" class="form-control" required v-model="statePC.newUnit" />
        </div>

        <div class="mb-3">
          <label class="form-label">Can Unit Be Converted?</label><br />
          <div class="btn-group" role="group" aria-label="Conversion option">
            <input
              type="radio"
              class="btn-check"
              name="conversion"
              id="radioNo"
              value="0"
              v-model="statePC.boolTF"
            />
            <label class="btn btn-outline-danger" for="radioNo">No</label>

            <input
              type="radio"
              class="btn-check"
              name="conversion"
              id="radioYes"
              value="1"
              v-model="statePC.boolTF"
            />
            <label class="btn btn-outline-success" for="radioYes">Yes</label>
          </div>
        </div>

        <div class="mb-3" v-if="statePC.boolTF == 1">
          <label class="form-label">Unit Conversion</label>
          <input type="text" class="form-control" required v-model="statePC.newUC" />
        </div>

        <div class="mb-3" v-if="statePC.boolTF == 1">
          <label class="form-label">Conversion Rate</label>
          <input type="number" class="form-control" required min="1" v-model="statePC.newConversionRate" />
        </div>

        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export default {
  name: "newProductCategories",
  components: {
    navBarInventory,
  },
  setup() {
    const { statePC, newPC } = productCategoriesCRUD()
    const router = useRouter()

    const validateAndSubmit = async () => {
      if (!statePC.newCn || !statePC.newUnit || statePC.boolTF === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Gagal',
          text: 'Nama kategori, unit, dan pilihan konversi wajib diisi!'
        });
        return;
      }

      if (statePC.boolTF == 1 && (!statePC.newUC || !statePC.newConversionRate)) {
        Swal.fire({
          icon: 'warning',
          title: 'Gagal',
          text: 'Isi unit konversi dan nilai konversinya!'
        });
        return;
      }

      try {
        const categoryId = await newPC();
        await Swal.fire({
          icon: 'success',
          title: 'Sukses',
          text: 'Kategori berhasil ditambahkan!'
        });
        router.push(`/uploadImageProductCategories?id=${categoryId}`);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat menambahkan kategori.'
        });
      }
    }

    return {
      statePC,
      validateAndSubmit
    }
  }
}
</script>

