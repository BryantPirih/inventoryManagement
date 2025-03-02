<template lang="">
    <div>
        <navBarInventory/>
        <body>
            <div class="newProducts">
                <router-link to="/newProductsWorker" class="nav-link">
                    <button class="btnNewProducts btn btn-success">New</button>
                </router-link>
                <h5 class="products">Products</h5>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Category</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Unit Conversion</th>
                    <th scope="col">Price</th>
                    <th scope="col">Description</th>
                    <th scope="col">Warehouse</th>
                    <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody v-for="item in stateProduct.product" :key="item.name">
                    <tr>
                    <th scope="row">1</th>
                    <td>{{item.name}}</td>
                    <td>{{item.stock}}</td>
                    <td>{{item.category}}</td>
                    <td>{{item.unit}}</td>
                    <td>{{item.unitConversion}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.warehouseId}}</td>
                    <td v-if="item.status === 1">Active</td>
                    <td v-else>Non-Active</td>
                    </tr>
                </tbody>
            </table>
            
        </body>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import productCRUD from '../modules/productCRUD.js'
import { onMounted } from 'vue'

export default {
    name:"productsWorker",
    components:{
        navBarInventory
    },
    setup(){
        const {stateProduct, getAllProduct} = productCRUD()

        onMounted(()=>{
            getAllProduct()
        })
        return {stateProduct, getAllProduct}
    }
}
</script>
<style lang="">
    
</style>