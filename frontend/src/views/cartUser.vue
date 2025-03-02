<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>daftar keranjang</h2>


    <div class="col mb-3" v-if="stateCart.cart.data != null">
        <div class="row-md-4 mt-d" v-for="item in stateCart.cart" :key="item.id">
            <cardCart :item="item"/>
        </div>
    </div>

    <div v-else>
      belom ada cart
    </div>

    

</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardCart from "@/components/cardCart.vue";
import cartCRUD from "../modules/cartCRUD.js";
import  {onMounted}  from "vue";
export default {
  name: "cartUser",
  components: {
    navBarUser,
    cardCart
  },
  setup() {
    const { stateCart, getOneCart } = cartCRUD();
    onMounted(() => {
        stateCart.newUsername = sessionStorage.getItem("username");
        console.log(getOneCart(stateCart.newUsername));
    });
    return { stateCart, getOneCart };
  }
};
</script>
<style lang="">
</style>