<template>
  <div>
    <navBarInventory />
    <div class="container my-5" style="max-width: 600px;">
      <div class="card shadow-sm p-4">
        <h4 class="fw-bold text-center mb-4">Upload Gambar Produk</h4>

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
          Gambar berhasil diunggah!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "uploadImageProductAdmin",
  components: { navBarInventory },
  setup() {
    const route = useRoute();
    const productId = route.query.id;

    const imageFile = ref(null);
    const preview = ref(null);
    const success = ref(false);

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
        formData.append("image", imageFile.value);
        formData.append("productId", productId);

        const res = await fetch("http://localhost:3000/product/upload-image", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          success.value = true;
        } else {
          alert("Gagal upload gambar.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Terjadi kesalahan saat upload.");
      }
    };

    return { onFileChange, uploadImage, imageFile, preview, success };
  }
};
</script>
