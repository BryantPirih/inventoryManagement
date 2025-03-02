<template lang="">
    <body class="bodyLogin">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="login-container">
                        <div class="login-header">
                            <h2>Login</h2>
                        </div>
                        <div class="login-form">
                            
                            <div class="mb-3">
                                <label for="usernameEmailMobile">Username/Email/Mobile</label>
                                <input type="text" class="form-control" id="usernameEmailMobile" 
                                placeholder="Enter username, email, or mobile number" required
                                v-model="stateLogin.newInput" >
                            </div>
                            <div class="mb-3">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" 
                                placeholder="Enter password" required
                                v-model="stateLogin.passwordInput">
                            </div>
                            <button @click="loging()"  class="btn btn-success ">Login</button>
                            
                            <p class="text-center mt-3">Don't have an account? 
                                <router-link to="/register" class="nav-link">Sign Up</router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    
</template>
<script>

import loginCRUD from '../modules/loginCRUD.js'
import axios from 'axios'
export default {
    name:"loginView",
    setup(){
        const {stateLogin, login} = loginCRUD()
        return {stateLogin, login}
    },
    methods:{
        async loging(){
            try {
                let result = await axios.post("http://localhost:3000/user/login",{
                    headers : {'Content-type' : 'application/json'},
                    credentials : 'include',
                    input: this.stateLogin.newInput,
                    password : this.stateLogin.passwordInput
                });

                if(result.status == 200){
                    if(result.data.role == 4){
                        sessionStorage.setItem('username',this.stateLogin.newInput)
                        this.$router.push({name:'homeUser'})
                    }else{
                        sessionStorage.setItem('username',this.stateLogin.newInput)
                        sessionStorage.setItem('role',result.data.role)
                        this.$router.push({name:'overviewWorker'})
                    }
                }else{
                    alert(result.data.message)
                }
            } catch (error) {
                if (error.response.status == 401){
                    alert('inccorect password')
                }else{
                    alert('credentials not found')
                }
            }
        }
    }

}
</script>
<style lang="">
    
</style>