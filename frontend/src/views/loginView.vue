<template>
  <div class="bodyLogin d-flex align-items-center justify-content-center min-vh-100">
    <div class="login-container">
      <div class="text-center mb-4">
        <h1 class="fw-bold" style="color: var(--brand-green)">Neo Grosir</h1>
        <p class="text-muted">Sign in to your account</p>
      </div>
      <div class="login-form">
        <div class="mb-3">
          <label for="usernameEmailMobile" class="form-label">Username / Email / Mobile</label>
          <input
            type="text"
            class="form-control"
            id="usernameEmailMobile"
            placeholder="Enter username, email, or mobile number"
            required
            v-model="stateLogin.newInput"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter password"
            required
            v-model="stateLogin.passwordInput"
          />
        </div>
        <button @click="loging()" class="btn btn-brand w-100">Login</button>
        <p class="text-center mt-3 mb-0">
          Don't have an account?
          <router-link to="/register" class="nav-link d-inline p-0"><p style="color: var(--brand-green)">Sign up</p></router-link>
        </p>
      </div>
    </div>
  </div>
</template>
  
<script>

import loginCRUD from '../modules/loginCRUD.js'
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    name:"loginView",
    setup(){
        const {stateLogin, login} = loginCRUD()
        return {stateLogin, login}
    },
    methods:{
        async loging() {
          const input = this.stateLogin.newInput?.trim();
          const password = this.stateLogin.passwordInput;

          if (!input || !password) {
            Swal.fire('Gagal', 'Username/email/nomor HP dan password harus diisi!', 'error');
            return;
          }

          try {
            let result = await axios.post("https://bmp-inv-be.zenbytes.id/user/login", {
              input: input,
              password: password
            }, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
            });

            if (result.status === 200) {
              sessionStorage.setItem('username', input);

              if (result.data.role == 4) {
                this.$router.push({ name: 'homeUser' });
              } else {
                sessionStorage.setItem('role', result.data.role);
                this.$router.push({ name: 'overviewWorker' });
              }
            }

          } catch (error) {
            if (error.response?.status === 401) {
              Swal.fire('Gagal', 'Password salah.', 'error');
            } else if (error.response?.status === 404) {
              Swal.fire('Gagal', 'Username/email/nomor HP tidak ditemukan.', 'error');
            } else {
              Swal.fire('Error', 'Terjadi kesalahan server.', 'error');
            }
          }
        }
    }

}
</script>
<style lang="">
    
</style>