<template lang="">
    <div>
        <navBarInventory/>
        <body>
            <div class="newProducts">
                <router-link to="/newWarehouse" class="nav-link">
                    <button class="btnNewProducts btn btn-success">New</button>
                </router-link>
                <h5 class="products">Warehouse</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Warehouse</th>
                    <th scope="col">Address</th>
                    <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody v-for="item in state.warehouse" :key="item.warehouse">
                    <tr>
                    <th scope="row">1</th>
                    <td>{{item.warehouse}}</td>
                    <td>{{item.address}}</td>
                    <td>Delete</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import {onMounted} from 'vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'

export default {
    name:"warehouseWorker",
    components:{
        navBarInventory
    },
    setup(){
        const {state, getAllWarehouse} = warehouseCRUD()

        onMounted(()=>{
            getAllWarehouse()
        })
        return {state, getAllWarehouse}
    }
}
</script>
<style lang="">
    
</style>