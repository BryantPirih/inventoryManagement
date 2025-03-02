<template lang="">
    <div>
        <navBarInventory/>
        <body class="container-fluid">
            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" id="username" name="username" class="form-control" required 
                        v-model="stateWorker.newUsername">
                    </div>
                    
                    <div class="mb-3">
                        <label for="username" class="form-label">Name</label>
                        <input type="text" id="name" name="name" class="form-control" required 
                        v-model="stateWorker.newName">
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required 
                        v-model="stateWorker.newEmail">
                    </div>
                    <div class="mb-3">
                        <label for="role" class="form-label">Role</label><br>
                        <select name="role" id="" class="form-select" v-model="stateWorker.newRole">
                            <option value="1">Admin</option>
                            <option value="2">Manager</option>
                            <option value="3">Karyawan</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="mobilephone" class="form-label">Mobile Phone</label>
                        <input type="number" id="mobile" name="mobile" class="form-control" required 
                        v-model="stateWorker.newMobilephone">
                    </div>
                    <div class="mb-3">
                        <label for="warehouse" class="form-label">Warehouse</label><br>
                        <select name="warehouse" id="" class="form-select" v-model="stateWorker.newWarehouseId">
                            <option v-for="item in state.warehouse" :key="item.id" 
                            :value="item.id">{{item.warehouse}}</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="username" class="form-label">Password</label>
                        <input type="password" id="password" name="password" class="form-control" required 
                        v-model="stateWorker.newPassword">
                    </div>
                    <button @click="newWorker()" type="submit" class="btn btn-success">Create</button>
                </form>
            </div>
        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import {onMounted} from 'vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'
import workerCRUD from '../modules/workerCRUD.js'

export default {
    name:"newWorker",
    components:{
        navBarInventory,
    },
    setup(){
        const {state, getAllWarehouse} = warehouseCRUD()
        const {stateWorker, newWorker} = workerCRUD()

        onMounted(()=>{
            getAllWarehouse()
        })

        return {state, getAllWarehouse, newWorker, stateWorker}
    }
}
</script>
<style lang="">
    
</style>