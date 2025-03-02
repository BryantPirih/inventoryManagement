<template lang="">
    <div>
        <navBarInventory/>
        <body class="container-fluid">
            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="username" class="form-label">Name</label>
                        <input type="text" id="username" name="username" class="form-control" required 
                        v-model="stateProduct.newNameP">
                        {{stateProduct.newNameP}}
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Stock</label>
                        <input type="text" id="name" name="name" class="form-control" required 
                        v-model="stateProduct.newStock">
                    </div>

                    <div class="mb-3">
                        <label for="warehouse" class="form-label">Warehouse</label><br>
                        <select name="warehouse" id="" class="form-select" v-model="stateProduct.newWarehouse">
                            <option v-for="item in state.warehouse" :key="item.id" 
                            :value="item.id">{{item.warehouse}}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="warehouse" class="form-label">Category</label><br>
                        <select name="warehouse" id="" class="form-select" v-model="stateProduct.newCategory">
                            <option v-for="item in statePC.productCategories" :key="item.categoriesName" 
                            :value="item.categoriesName">{{item.categoriesName}}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="username" class="form-label">Price</label>
                        <input type="number" id="Price" name="Price" class="form-control" required 
                        v-model="stateProduct.newPrice">
                    </div>
                    
                    <div class="mb-3">
                        <label for="mobilephone" class="form-label">Description</label>
                        <input type="text" id="Description" name="Description" class="form-control" required 
                        v-model="stateProduct.newDesc">
                    </div>
                    <div class="mb-3">
                        <label for="role" class="form-label">Status</label><br>
                        <select name="role" id="" class="form-select" v-model="stateProduct.newStatus">
                            <option value="1">Active</option>
                            <option value="2">Non-Active</option>
                        </select>
                    </div>

                    <button @click="newProduct()" type="submit" class="btn btn-success">Create</button>
                </form>
            </div>
        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import {onMounted} from 'vue'
import productCRUD from '../modules/productCRUD.js'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
import warehouseCRUD from '../modules/warehouseCRUD.js'

export default {
    name:"newProduct",
    components:{
        navBarInventory,
    },
    setup(){
        const {stateProduct, newProduct} = productCRUD()
        const {statePC, getAllProductCategories} = productCategoriesCRUD()
        const {state, getAllWarehouse} = warehouseCRUD()

        onMounted(()=>{
            getAllProductCategories()
            getAllWarehouse()
        })

        return {statePC, getAllProductCategories, newProduct, stateProduct,state,getAllWarehouse}
    }
}
</script>
<style lang="">
    
</style>