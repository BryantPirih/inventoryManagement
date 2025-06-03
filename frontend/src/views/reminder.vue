<template>
  <div>
    <navBarInventory />
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Reminders</h5>
        <router-link to="/newReminder" class="btn btn-success">New</router-link>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Message</th>
            <th>Remind At</th>
            <th>Sent?</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stateReminder.reminders" :key="item.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ item.title }}</td>
            <td>{{ item.message }}</td>
            <td>{{ new Date(item.remindAt).toLocaleString() }}</td>
            <td>
              <span :class="item.isSent ? 'text-success' : 'text-warning'">
                {{ item.isSent ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-danger" @click="handleDelete(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import reminderCRUD from '../modules/reminderCRUD'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'

export default {
  name: "reminderView",
  components: { navBarInventory },
  setup() {
    const { stateReminder, getAllReminder, deleteReminder } = reminderCRUD()

    const handleDelete = (id) => {
      Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: "Reminder ini akan dihapus secara permanen.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteReminder(id).then(() => {
            Swal.fire('Berhasil!', 'Reminder telah dihapus.', 'success')
          }).catch(() => {
            Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus.', 'error')
          })
        }
      })
    }

    onMounted(() => {
      getAllReminder()
    })

    return { stateReminder, getAllReminder, deleteReminder, handleDelete }
  }
}
</script>

<style scoped>
</style>
