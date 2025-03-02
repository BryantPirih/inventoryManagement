<template lang="">
    <div>
        <navBarUser/>
    </div>

    <body>
        <div class="row mt-3">
            <div class="col-md-6">
                <!-- <img src="" alt=""> -->
            </div>
            <div class="col-md-6" v-if="stateProduct.product && stateProduct.product.data">
                <h2><strong>{{stateProduct.product.data.name}}</strong></h2>
                <hr>
                <h4>Rp.{{stateProduct.product.data.price}}</h4>
                <h6>{{stateProduct.product.data.description}}</h6>
                
                <button v-on:click="kurangi">-</button>
                  <input id="jumlah" name="jumlah" required v-model="stateProduct.jumlahKeranjang">
                <button v-on:click="tambah">+</button>sisa stock:{{stateProduct.product.data.stock}}<br>
                
                <button @click="newCart()">+keranjang</button>
                
                <button @click="beli()" class="btnBeliSekarang">beli sekarang</button>
                
                <button @click="newWishlist()">wishlist</button><br>
            </div>
        </div>
        
        <!-- <div v-if="stateProduct.product.data">
          {{stateProduct.product.data.name}}
        </div> -->
        
    </body>


</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import productCRUD from "../modules/productCRUD.js";
import cartCRUD from "../modules/cartCRUD.js";
import wishlistCRUD from "../modules/wishlistCRUD.js";
import { onBeforeMount, ref} from "vue";
import { useRoute } from "vue-router";
export default {
  name: "detailProduct",
  components: {
    navBarUser,
  },
  methods: {
    beli : function () {
      sessionStorage.setItem('barang',this.stateProduct.product.data.id)
      sessionStorage.setItem('qty',this.stateProduct.jumlahKeranjang)
      this.$router.push({name:'checkoutUser'})
    },
    kurangi: function () {
      this.stateProduct.jumlahKeranjang -= 1;
    },
    tambah: function () {
      this.stateProduct.jumlahKeranjang += 1;
    },
  },
  setup() {
    const { stateProduct, getOneProduct } = productCRUD();
    const { stateCart, newCart } = cartCRUD();
    const { stateWishlist, newWishlist } = wishlistCRUD();
    const productName = ref("")
    
    let route = useRoute();
    onBeforeMount(() => {
      getOneProduct(route.params.id);

      stateCart.newUsername = sessionStorage.getItem("username");
      stateCart.newProductID = sessionStorage.getItem("barang");

      stateWishlist.newUsername = sessionStorage.getItem("username");
      stateWishlist.newProductID = sessionStorage.getItem("barang");
    });
    return { stateProduct, getOneProduct, stateCart, newCart, stateWishlist, newWishlist,productName };
  },
};
</script>
<style lang="">
</style>