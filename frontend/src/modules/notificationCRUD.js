import { reactive } from 'vue'
import axios from 'axios'

const useNotification = () => {
  const stateNotification = reactive({
    notifications: [],
  })

  const getNotifications = async (username) => {
    try {
      const res = await axios.get(`http://localhost:3000/notification/${username}`)
      stateNotification.notifications = res.data
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/notification/mark-read/${id}`)
      const notif = stateNotification.notifications.find(n => n._id === id)
      if (notif) notif.isRead = true
    } catch (err) {
      console.error('❌ Failed to mark as read:', err)
    }
  }

  const markAllAsRead = async (username) => {
    try {
      await axios.put(`http://localhost:3000/notification/mark-all-read/${username}`)
      stateNotification.notifications.forEach(n => n.isRead = true)
    } catch (err) {
      console.error('❌ Failed to mark all as read:', err)
    }
  }

  return {
    stateNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
  }
}

export default useNotification
