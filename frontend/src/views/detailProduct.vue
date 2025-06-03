<template>
  <div>
    <navBarUser />

    <div class="container my-4">
      <div class="row">

        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img
            :src="'https://bmp-inv-be.zenbytes.id' + (stateProduct.product?.data?.imageUrl || '/uploads/products/default.png')"
            alt="Product Image"
            style="max-height: 300px; object-fit: cover;"
            class="img-fluid rounded shadow"
          />

        </div>

        <div class="col-md-6" v-if="stateProduct.product?.data">
          <h2 class="fw-bold">{{ stateProduct.product.data.name }}</h2>
          <hr>
          <h4 class="mb-3">Rp {{ parseInt(stateProduct.product.data.price).toLocaleString('id') }}</h4>
          <p class="text-muted">{{ stateProduct.product.data.description }}</p>

          <div class="d-flex align-items-center mb-3">
            <button class="btn btn-outline-secondary" @click="kurangi">-</button>
            <input
              type="number"
              v-model="stateProduct.jumlahKeranjang"
              class="form-control mx-2"
              style="width: 70px;"
            />
            <button class="btn btn-outline-secondary" @click="tambah">+</button>
            <small class="ms-3 text-muted">
              Sisa stok: {{ stateProduct.product.data.stock }}
            </small>
          </div>

          <div class="d-flex flex-wrap gap-2 mt-3">
            <button @click="addCartHandler" class="btn btn-outline-success">
              Keranjang 
            </button>
            <button @click="beli" class="btn btn-success">
              Beli Sekarang
            </button>
            <button @click="addWishlistHandler" class="btn btn-outline-success">
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import productCRUD from "../modules/productCRUD.js";
import cartCRUD from "../modules/cartCRUD.js";
import wishlistCRUD from "../modules/wishlistCRUD.js";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';


export default {
  name: "detailProduct",
  components: { navBarUser },
  setup() {
    const { stateProduct, getOneProductMainWarehouse } = productCRUD();
    const { stateCart, newCart } = cartCRUD();
    const { stateWishlist, newWishlist } = wishlistCRUD();
    const route = useRoute();

    onBeforeMount(() => {
      getOneProductMainWarehouse(route.params.id);
    });

    const kurangi = () => {
      if (stateProduct.jumlahKeranjang > 1) {
        stateProduct.jumlahKeranjang--;
      }
    };

    const tambah = () => {
      if (stateProduct.jumlahKeranjang < stateProduct.product.data.stock) {
        stateProduct.jumlahKeranjang++;
      }
    };

    const beli = () => {
      sessionStorage.setItem("barang", stateProduct.product.data.id);
      sessionStorage.setItem("qty", stateProduct.jumlahKeranjang);
      window.location.href = "/checkoutUser";
    };

    const addCartHandler = async () => {

      stateCart.newUsername    = sessionStorage.getItem("username");
      stateCart.newProductID   = stateProduct.product.data.id;
      stateCart.newProductName = stateProduct.product.data.name;
      stateCart.newQty         = stateProduct.jumlahKeranjang;

      await newCart();  
      Swal.fire({
        icon: 'success',
        title: 'Ditambahkan ke Keranjang',
        text: `${stateProduct.jumlahKeranjang} × ${stateProduct.product.data.name} berhasil ditambahkan.`,
        timer: 2000,
        showConfirmButton: false
      });
    };

    const addWishlistHandler = async () => {
      stateWishlist.newUsername    = sessionStorage.getItem("username");
      stateWishlist.newProductID   = stateProduct.product.data.id;
      stateWishlist.newProductName = stateProduct.product.data.name;
      stateWishlist.newQuantity    = stateProduct.jumlahKeranjang; 

      await newWishlist(); 
      Swal.fire({
        icon: 'success',
        title: 'Ditambahkan ke Wishlist',
        text: `${stateProduct.jumlahKeranjang} × ${stateProduct.product.data.name} berhasil ditambahkan.`,
        timer: 2000,
        showConfirmButton: false
      });
    };

    return {
      stateProduct,
      kurangi,
      tambah,
      beli,
      addCartHandler,
      addWishlistHandler
    };
  }
};
</script>

<style scoped>
img {
  object-fit: contain;
}
</style>
