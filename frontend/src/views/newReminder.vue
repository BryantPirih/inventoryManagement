<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h5 class="mb-3">Create New Reminder</h5>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            v-model="stateReminder.newTitle"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">Message</label>
          <textarea
            id="message"
            v-model="stateReminder.newMessage"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="remindAt" class="form-label">Remind At</label>
          <input
            type="datetime-local"
            id="remindAt"
            v-model="stateReminder.newRemindAt"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-success">Create Reminder</button>
        <router-link to="/reminder" class="btn btn-secondary ms-2">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import reminderCRUD from '../modules/reminderCRUD'
import { useRouter } from 'vue-router'

export default {
  name: "newReminderView",
  components: { navBarInventory },
  setup() {
    const router = useRouter()
    const { stateReminder, newReminder } = reminderCRUD()
    
    const handleSubmit = async () => {
      const success = await newReminder()
      if (success) {
        router.push('/reminder')
      } else {
        alert('Failed to create reminder')
      }
    }

    return { stateReminder, handleSubmit }
  }
}
</script>

<style scoped>
</style>
