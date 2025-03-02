<template lang="">
    <div>
        <navBarInventory/>

        <body class="container-fluid">

            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="username" class="form-label">Product Categories</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="statePC.newCn" >
                        
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Unit</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="statePC.newUnit">
                        
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Unit Conversion</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="statePC.newUC">
                        
                    </div>
                    
                    <div class="mb-3">
                        <label for="username" class="form-label">Can unit categories be converted</label><br>
                        <div class="btn-group" role="group" aria-label="Basic radio toggle button group" >
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked 
                            value=0 v-model="statePC.boolTF">
                            <label class="btn btn-outline-danger" for="btnradio1">Tidak</label>

                            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" 
                            value=1 v-model="statePC.boolTF">
                            <label class="btn btn-outline-success" for="btnradio2">Iya</label>
                        </div>
                    </div>


                    <button @click="newPC()" type="submit" class="btn btn-success">Create</button>
                </form>
            </div>

        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import productCategoriesCRUD from '../modules/productCategoriesCRUD.js'
//import {onMounted} from 'vue'

export default {
    name:"newProductCategories",
    components:{
        navBarInventory,
    },
    setup(){
        const {statePC, newPC} = productCategoriesCRUD()

        return {statePC, newPC}
    }
}
</script>
<style lang="">
    
</style>