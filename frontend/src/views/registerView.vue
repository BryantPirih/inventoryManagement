<template>
    <div class="colorBody min-vh-100 d-flex align-items-center justify-content-center">
      <div class="register-container">
        <div class="text-center mb-4">
            <h1 class="fw-bold" style="color: var(--brand-green)">Neo Grosir</h1>
            <p class="text-muted">Sign up new account</p>
        </div>
        <form @submit.prevent="newUser">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" id="username" class="form-control" required v-model="stateUser.newUsername" />
          </div>
  
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" required v-model="stateUser.newEmail" />
          </div>
  
          <div class="mb-3">
            <label for="mobile" class="form-label">Mobile Number</label>
            <input type="tel" id="mobile" class="form-control" required v-model="stateUser.newMobilePhone" />
          </div>
  
          <div class="mb-3">
            <label for="fullname" class="form-label">Full Name</label>
            <input type="text" id="fullname" class="form-control" required v-model="stateUser.newFullname" />
          </div>
  
          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-control" required v-model="stateUser.newPassword" />
          </div>
  
          <button type="submit" class="btn btn-brand w-100">Register</button>
        </form>
  
        <p class="text-center mt-3">
          Already have an account?
          <router-link to="/login" class="nav-link d-inline p-0"><p style="color: var(--brand-green)">Sign in</p></router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import userCRUD from '../modules/userCRUD.js'
  
  export default {
    name: "registerView",
    setup() {
      const { stateUser, newUser } = userCRUD()
      return { stateUser, newUser }
    }
  }
  </script>
  