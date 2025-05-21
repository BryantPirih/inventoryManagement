import { reactive } from 'vue';

const getUsers = () => {
  const stateUser = reactive({
    newUsername: '',
    newFullname: '',
    newEmail: '',
    newRole: '4',
    newMobilePhone: '',
    newPassword: '',
    user: [],
    currentUser: {},
    updateMessage: '',    
  });

  // Get all users
  const getAllUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/user/");
      const data = await res.json();
      stateUser.user = data;
    } catch (error) {
      console.log(error);
    }
  };

  // Create a new user
  const newUser = () => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: stateUser.newUsername,
        email: stateUser.newEmail,
        role: stateUser.newRole,
        mobilePhone: stateUser.newMobilePhone,
        fullName: stateUser.newFullname,
        password: stateUser.newPassword,
      }),
    };
    fetch("http://localhost:3000/user/new", request);
  };

  // Get current logged-in user
  const getCurrentUser = async (username) => {
    try {
      const res = await fetch("http://localhost:3000/user/");
      const data = await res.json();
      const user = data.find(u => u.username === username);
      if (user) {
        stateUser.currentUser = user;
      }
    } catch (err) {
      console.error("Error getting user:", err);
    }
  };

  // Update profile for logged-in user
  const updateCurrentUser = async (username) => {
    try {
      const res = await fetch(`http://localhost:3000/user/update/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: stateUser.currentUser.email,
          mobilePhone: stateUser.currentUser.mobilePhone,
          fullName: stateUser.currentUser.fullName,
          password: stateUser.currentUser.password, // optional
        }),
      });

      const result = await res.json();
      stateUser.updateMessage = result.message || "Profil berhasil diperbarui";
    } catch (err) {
      console.error("Failed to update user:", err);
      stateUser.updateMessage = "Gagal memperbarui profil";
    }
  };

  return {
    stateUser,
    getAllUser,
    newUser,
    getCurrentUser,
    updateCurrentUser,
  };
};

export default getUsers;
