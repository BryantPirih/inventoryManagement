import { reactive } from 'vue'

const getReminder = () => {
  const stateReminder = reactive({
    newTitle: '',
    newMessage: '',
    newCreatedBy: '',
    newRemindAt: '',
    reminders: [] // changed from singular to plural
  })

  const getAllReminder = async () => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/reminder/")
      const data = await res.json()
      stateReminder.reminders = data
    } catch (error) {
      console.error("Failed to fetch reminders:", error)
    }
  }

  const newReminder = async () => {
    try {
        const userId = sessionStorage.getItem('username') // or 'username', 'email', etc.
        if (!userId) throw new Error("User not logged in")
        const response = await fetch("https://bmp-inv-be.zenbytes.id/reminder/new", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            title: stateReminder.newTitle,
            message: stateReminder.newMessage,
            remindAt: stateReminder.newRemindAt,
            createdBy: userId
            })
        })

        if (!response.ok) {
            throw new Error("Failed to create reminder")
        }

      return true
    } catch (error) {
      console.error("Error creating reminder:", error)
      return false
    }
  }

  const deleteReminder = async (id) => {
  try {
    await fetch(`https://bmp-inv-be.zenbytes.id/reminder/${id}`, {
      method: "DELETE"
    });
    await getAllReminder();
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
};


  

  return {
    stateReminder,
    getAllReminder,
    newReminder,
    deleteReminder
  }
}

export default getReminder
