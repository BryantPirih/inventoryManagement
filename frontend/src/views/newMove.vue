<template lang="">
    <div>
        <navBarInventory/>

        <body class="container-fluid">
            
            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="warehouse" class="form-label">Product</label><br>
                        <select name="warehouse" id="" class="form-select" v-model="stateMove.newProduct">
                            <option v-for="item in stateProduct.product" :key="item.id" 
                            :value="item.id">{{item.name}}</option>
                        </select>
                        {{stateMove.newProduct}}
                    </div>

                    <div class="mb-3">
                        <label for="username" class="form-label">Quantity</label>
                        <input type="text" id="name" name="name" class="form-control" required 
                        v-model="stateMove.newQuantity">
                        {{stateMove.newQuantity}}
                    </div>


                    <button @click="newMove()" type="submit" class="btn btn-success">request</button>
                </form>
            </div>

        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import {onBeforeMount} from 'vue'
import productCRUD from '../modules/productCRUD.js'
import moveCRUD from '../modules/moveCRUD.js'

export default {
    name:"newProduct",
    components:{
        navBarInventory,
    },
    setup(){
        const {stateProduct, getAllProduct} = productCRUD()
        const {stateMove, newMove} = moveCRUD()
        onBeforeMount(()=>{
            stateMove.newRequester = sessionStorage.getItem('username')
            getAllProduct()
        })

        return {stateProduct,getAllProduct,stateMove,newMove}
    }
}
</script>
<style lang="">
    
</style>