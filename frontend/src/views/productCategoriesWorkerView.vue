<template lang="">
    <div>
        <navBarInventory/>
        <body>
            <div class="newProducts">
                <router-link to="/newProductCategories" class="nav-link">
                    <button class="btnNewWorker btn btn-success">New</button>
                </router-link>
                <h5 class="products">Product Categories</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Unit Conversion</th>
                    <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody v-for="item in statePC.productCategories" :key="item.name">
                    <tr>
                    <th scope="row">1</th>
                    <td>{{item.categoriesName}}</td>
                    <td>{{item.unit}}</td>
                    <td v-if="item.unitConversion === '' ">-</td>
                    <td v-else>{{item.unitConversion}}</td>
                    <td>Delete</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
import { onMounted } from 'vue'

export default {
    name:"productCategoriesWorkerView",
    components:{
        navBarInventory
    },
    setup(){
        const {statePC, getAllProductCategories} = productCategoriesCRUD()

        onMounted(()=>{
            getAllProductCategories()
        })
        return {statePC, getAllProductCategories}
    }
}
</script>
<style lang="">
    
</style>