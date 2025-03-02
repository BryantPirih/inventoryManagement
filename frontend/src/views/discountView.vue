<template lang="">
    <div>
        <navBarInventory/>
        <body>
            <div class="newProducts">
                <router-link to="/newDiscount" class="nav-link">
                    <button class="btnNewWorker btn btn-success">New</button>
                </router-link>
                <h5 class="products">Discount</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Code</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody v-for="item in stateDiscount.discount" :key="item.name">
                    <tr>
                    <th scope="row">1</th>
                    <td>{{item.name}}</td>
                    <td>{{item.discountCode}}</td>
                    <td>Delete</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import discountCRUD from '../modules/discountCRUD.js'
import { onBeforeMount } from 'vue'

export default {
    name:"discountOverview",
    components:{
        navBarInventory
    },
    setup(){
        const {stateDiscount, getAllDiscount} = discountCRUD()

        onBeforeMount(()=>{
            getAllDiscount()
        })
        return {stateDiscount, getAllDiscount}
    }
}
</script>
<style lang="">
    
</style>