<template>
  <div>
    <navBarUser />

    <div class="container my-4">
      <div class="row">
        <!-- Product Image -->
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img
            :src="'http://localhost:3000' + (stateProduct.product?.data?.imageUrl || '/uploads/products/default.png')"
            alt="Product Image"
            style="max-height: 300px; object-fit: cover;"
            class="img-fluid rounded shadow"
          />

        </div>

        <!-- Product Info -->
        <div class="col-md-6" v-if="stateProduct.product?.data">
          <h2 class="fw-bold">{{ stateProduct.product.data.name }}</h2>
          <hr>
          <h4 class="mb-3">Rp {{ parseInt(stateProduct.product.data.price).toLocaleString('id') }}</h4>
          <p class="text-muted">{{ stateProduct.product.data.description }}</p>

          <!-- Quantity Control -->
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

          <!-- Action Buttons -->
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
      // set the reactive stateCart fields
      stateCart.newUsername    = sessionStorage.getItem("username");
      stateCart.newProductID   = stateProduct.product.data.id;
      stateCart.newProductName = stateProduct.product.data.name;
      stateCart.newQty         = stateProduct.jumlahKeranjang;

      await newCart();  // uses stateCart internally
      alert(`Added ${stateProduct.jumlahKeranjang} × ${stateProduct.product.data.name} to cart`);
    };

    const addWishlistHandler = async () => {
      // set the reactive stateWishlist fields
      stateWishlist.newUsername    = sessionStorage.getItem("username");
      stateWishlist.newProductID   = stateProduct.product.data.id;
      stateWishlist.newProductName = stateProduct.product.data.name;
      stateWishlist.newQuantity    = stateProduct.jumlahKeranjang; // if your crud uses it

      await newWishlist();  // uses stateWishlist internally
      alert(`Added ${stateProduct.jumlahKeranjang} × ${stateProduct.product.data.name} to wishlist`);
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
