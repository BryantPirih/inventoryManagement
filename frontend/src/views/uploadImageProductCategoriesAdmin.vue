<template>
  <div>
    <navBarInventory />
    <div class="container my-5" style="max-width: 600px;">
      <div class="card shadow-sm p-4">
        <h4 class="fw-bold text-center mb-4">Upload Gambar Kategori</h4>

        <div class="mb-3">
          <label class="form-label">Pilih Gambar</label>
          <input type="file" @change="onFileChange" class="form-control" accept="image/*" />
        </div>

        <div v-if="preview" class="text-center mb-3">
          <img :src="preview" class="img-thumbnail" style="max-height: 250px;" />
        </div>

        <button @click="uploadImage" class="btn btn-success w-100" :disabled="!imageFile">
          Upload
        </button>

        <div v-if="success" class="alert alert-success mt-3 text-center">
          Gambar kategori berhasil diunggah!
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navBarInventory from '@/components/NavBarInventory.vue';
import Swal from 'sweetalert2'; 

export default {
  name: 'uploadImageProductCategories',
  components: { navBarInventory },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const categoryId = route.query.id;

    const imageFile = ref(null);
    const preview = ref(null);

    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        imageFile.value = file;
        preview.value = URL.createObjectURL(file);
      }
    };

    const uploadImage = async () => {
      try {
        const formData = new FormData();
        formData.append("icon", imageFile.value);
        formData.append("categoryId", categoryId);

        const res = await fetch("https://bmp-inv-be.zenbytes.id/productCategories/upload-icon", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Gambar kategori berhasil diunggah.',
            confirmButtonText: 'OK'
          });
          router.push('/productCategoriesWorker');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal upload gambar kategori.'
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat upload.'
        });
      }
    };

    return {
      onFileChange,
      uploadImage,
      imageFile,
      preview
    };
  }
};
</script>