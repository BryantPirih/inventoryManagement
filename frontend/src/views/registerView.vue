<template lang="">
    <div class="colorBody">
        <div class="register-container">
            <h1>Register</h1>
            <form>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" name="username" class="form-control" required
                    v-model="stateUser.newUsername">
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" name="email" class="form-control" required
                    v-model="stateUser.newEmail">
                </div>

                <div class="mb-3">
                    <label for="mobile" class="form-label">Mobile Number</label>
                    <input type="tel" id="mobile" name="mobile" class="form-control" required
                    v-model="stateUser.newMobilePhone">
                </div>

                <div class="mb-3">
                    <label for="fullname" class="form-label">Full Name</label>
                    <input type="text" id="fullname" name="fullname" class="form-control" required
                    v-model="stateUser.newFullname">
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" name="password" class="form-control" required
                    v-model="stateUser.newPassword">
                </div>

                <button @click="newUser()" type="submit" class="btn btn-success">Register</button>
            </form>
            <p class="text-center mt-3">Already have an account? 
                <router-link to="/login" class="nav-link">Log in</router-link></p>
        </div>
    </div>
</template>
<script>
import userCRUD from '../modules/userCRUD.js'

export default {
    name:"registerView",
    setup(){
        const {stateUser, newUser} = userCRUD()
        
        return {stateUser, newUser}
    }
}
</script>
<style lang="">
    
</style>