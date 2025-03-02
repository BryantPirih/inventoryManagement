<template lang="">
    <div>
        <navBarInventory/>
    </div>
    <body>  
        <div class="col-md-6" v-if="stateProduct.product && stateProduct.product.data">
            <h2> Detail product</h2>
            <h2><strong>{{stateProduct.product.data.id}}</strong></h2>
            <hr>
            <h4> Product Id : {{stateProduct.product.data.id}}</h4>
            <h4> Product Name : {{stateProduct.product.data.name}}</h4>
            <h4> Stock : {{stateProduct.product.data.stock}}</h4>
            <h4> Description : {{stateProduct.product.data.description}}</h4>
            <h4 class="card-text"  v-if="stateProduct.product.data.status === 1 ">Status : Active</h4>
            <h4 class="card-text"  v-else>Status : Inactive</h4>
            <button @click="updateStatusProduct(stateProduct.product.data.id,stateProduct.product.data.status)" >Update status</button>
        </div>

        <hr>
        <h2> Update barang</h2> <br>
        <h6> Stok Baru:</h6>
        <input
        type="number"
        v-model="stateProduct.newStock"
        placeholder="Enter stock"
        /><br>
        <h6> Deskripsi baru:</h6>
        <input
        type="text"
        v-model="stateProduct.newDescription"
        placeholder="Enter description"
        /><br>
        <button @click="updateProduct(stateProduct.product.data.id,stateProduct.newStock,stateProduct.newDescription)" >Update Barang</button>
    </body>


</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import productCRUD from "../modules/productCRUD.js";
import { onBeforeMount} from "vue";
import { useRoute } from "vue-router";
export default {
  name: "editProduct",
  components: {
    navBarInventory,
  },
  setup() {
    const {stateProduct , getOneProduct, updateProduct,updateStatusProduct} = productCRUD();
    let route = useRoute();

    onBeforeMount(() => {
        getOneProduct(route.params.id);
    });

    return {stateProduct,
        getOneProduct,
        updateProduct,
        updateStatusProduct
    }
  },
};
</script>
<style lang="">
</style>