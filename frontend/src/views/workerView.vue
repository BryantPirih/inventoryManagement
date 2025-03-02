<template lang="">
    <div>
        <navBarInventory/>
        <body>
            <div class="newProducts">
                <router-link to="/newWorker" class="nav-link">
                    <button class="btnNewWorker btn btn-success">New</button>
                </router-link>
                <h5 class="products">Worker</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile phone</th>
                    <th scope="col">Role</th>
                    <th scope="col">Warehouse/Toko</th>
                    </tr>
                </thead>
                <tbody v-for="item in stateWorker.workers" :key="item.name">
                    <tr>
                    <th scope="row">1</th>
                    <td>{{item.username}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.email}}</td>
                    <td>{{item.mobilePhone}}</td>
                    <td v-if="item.role === 1">Admin</td>
                    <td v-else-if="item.role === 2">Manager</td>
                    <td v-else>Karyawan</td>
                    <td>{{item.warehouseId}}</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import workerCRUD from '../modules/workerCRUD.js'
import { onMounted } from 'vue'

export default {
    name:"workerView",
    components:{
        navBarInventory
    },
    setup(){
        const {stateWorker, getAllWorker} = workerCRUD()

        onMounted(()=>{
            getAllWorker()
        })
        return {stateWorker, getAllWorker}
    }
}
</script>
<style lang="">
    
</style>