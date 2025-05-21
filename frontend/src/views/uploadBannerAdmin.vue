<template>
  <div>
    <navBarInventory />

    <div class="container my-5" style="max-width: 600px;">
      <div class="card shadow-sm p-4">
        <h4 class="fw-bold text-center mb-4">Upload Gambar Banner</h4>

        <div class="mb-3">
          <label class="form-label">Pilih Gambar Banner</label>
          <input type="file" @change="onFileChange" class="form-control" accept="image/*" />
        </div>

        <div v-if="preview" class="text-center mb-3">
          <img :src="preview" class="img-thumbnail" style="max-height: 300px;" />
        </div>

        <button @click="uploadBanner" class="btn btn-success w-100" :disabled="!imageFile">
          Upload Banner
        </button>

        <div v-if="success" class="alert alert-success mt-3 text-center">
          Banner berhasil diunggah!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import navBarInventory from '@/components/NavBarInventory.vue';

export default {
  name: 'uploadBannerAdmin',
  components: { navBarInventory },
  setup() {
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

    const uploadBanner = async () => {
      try {
        const formData = new FormData();
        formData.append("banner", imageFile.value);

        const res = await fetch("https://bmp-inv-be.zenbytes.id/banner/upload", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          success.value = true;
        } else {
          alert("Gagal upload banner.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Terjadi kesalahan saat upload.");
      }
    };

    return { onFileChange, uploadBanner, imageFile, preview, success };
  }
};
</script>
