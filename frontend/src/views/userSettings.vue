<template>
  <div>
    <navBarUser /> <!-- ✅ Added navbar -->

    <div class="container my-5" style="max-width: 500px;">
      <h3 class="mb-4 fw-bold text-center">Edit Profil Anda</h3>

      <div class="card shadow-sm p-4">
        <div class="mb-3">
          <label class="form-label">Nama Lengkap</label>
          <input
            v-model="stateUser.currentUser.fullName"
            class="form-control"
            type="text"
            placeholder="Masukkan nama baru (opsional)"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="stateUser.currentUser.email"
            class="form-control"
            type="email"
            placeholder="Masukkan email baru (opsional)"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">No. HP</label>
          <input
            v-model="stateUser.currentUser.mobilePhone"
            class="form-control"
            type="number"
            placeholder="Masukkan nomor HP baru (opsional)"
          />
        </div>

        <div class="mb-4">
          <label class="form-label">Password Baru</label>
          <input
            v-model="stateUser.currentUser.password"
            class="form-control"
            type="password"
            placeholder="Kosongkan jika tidak ingin ganti password"
          />
        </div>

        <button
          class="btn w-100"
          :style="{ backgroundColor: '#37FD12', color: '#000' }"
          @click="update"
        >
          Simpan Perubahan
        </button>

        <div v-if="stateUser.updateMessage" class="alert alert-info mt-3 text-center">
          {{ stateUser.updateMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import userCRUD from '@/modules/userCRUD';
import navBarUser from '@/components/navBarUser.vue'; // ✅ import navbar

export default {
  name: 'userSettings',
  components: {
    navBarUser
  },
  setup() {
    const { stateUser, getCurrentUser, updateCurrentUser } = userCRUD();
    const username = sessionStorage.getItem('username');

    const update = async () => {
      if (username) {
        await updateCurrentUser(username);
      }
    };

    onMounted(async () => {
      if (username) {
        await getCurrentUser(username);
        stateUser.currentUser.password = '';
      }
    });

    return {
      stateUser,
      update
    };
  }
};
</script>
