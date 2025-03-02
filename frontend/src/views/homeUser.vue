<template lang="">
    <div>
        <navBarUser/>
    </div>

    <body>
        <div class="carousel">
          
        </div>
        <div class="row mb-3">
            <div class="col-md-4 mt-d" v-for="item in stateProduct.product" :key="item.name">
                <router-link :to="'/product/'+item.id"> <cardProduct :item="item"/> </router-link>
            </div>
        </div>
    </body>


</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardProduct from "@/components/cardProduct.vue";
import productCRUD from "../modules/productCRUD.js";
import { onMounted } from "vue";
export default {
  name: "homeUser",
  components: {
    navBarUser,
    cardProduct,
  },
  setup() {
    const { stateProduct, getAllProduct } = productCRUD();

    onMounted(() => {
      getAllProduct();
    });

    return { stateProduct, getAllProduct };
  },
};
</script>
<style lang="">
</style>