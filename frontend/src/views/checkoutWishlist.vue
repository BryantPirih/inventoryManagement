<template>
  <div>
    <navBarUser />
    <div class="container my-4">
      <h2 class="mb-4">Checkout Wishlist</h2>
      <!-- Alamat Pengiriman -->
      <div class="card p-3 mb-4">
        <h5 class="card-title">Alamat Pengiriman</h5>
        <div v-if="defaultAddress">
          <p><strong>{{ defaultAddress.recipientName }}</strong></p>
          <p>
            {{ defaultAddress.fullAddress }}, {{ defaultAddress.district }},
            {{ defaultAddress.subDistrict }}, {{ defaultAddress.city }},
            {{ defaultAddress.province }}, {{ defaultAddress.postalCode }}
          </p>
          <p>Email: {{ defaultAddress.recipientEmail }}</p>
          <p>Telp: {{ defaultAddress.recipientPhone }}</p>
        </div>
        <div v-else class="text-muted">Belum ada alamat pengiriman.</div>
      </div>

      <!-- Ringkasan Produk -->
      <div class="card p-4 mb-4 shadow-sm">
        <h5 class="card-title">Ringkasan Produk</h5>
          <div v-if="stateWishlist.wishlist.items && stateProduct.product">
            <div v-for="wishlistItem in stateWishlist.wishlist.items" :key="wishlistItem.productID" class="mb-3">
            <p><strong>{{ wishlistItem.productName }}</strong></p>
            <p>Harga: Rp {{ parseInt(getProductPrice(wishlistItem.productID)).toLocaleString('id') }}</p>
            <p>Jumlah: {{ wishlistItem.quantity }}</p>
          </div>
        </div>
        <div v-else class="text-muted">Tidak ada produk dalam wishlist.</div>
      </div>

      <!-- Metode Pembayaran -->
      <div class="card p-3 mb-4">
        <h5 class="card-title">Metode Pembayaran</h5>
        <div class="form-check">
          <input class="form-check-input" type="radio" v-model="pick" :value="0" name="paymentMethod" id="cod" />
          <label class="form-check-label" for="cod">Cash On Delivery (COD)</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" v-model="pick" :value="1" name="paymentMethod" id="gateway" />
          <label class="form-check-label" for="gateway">Payment Gateway</label>
        </div>
      </div>

      <!-- Diskon -->
      <div class="card p-3 mb-4">
        <h5 class="card-title">Voucher</h5>
        <router-link
          to="/discountPage"
          class="nav-link p-0"
          @click="handleDiscountClick"
        >
          <button class="btn btn-outline-success">
            <i class="bi bi-percent"></i>
            {{ discountCode || "Klik untuk pakai diskon" }}
          </button>
        </router-link>
      </div>

      <!-- Ringkasan Pembayaran -->
      <div class="card p-3 mb-4">
        <h5 class="card-title">Ringkasan Pembayaran</h5>
        <p>Subtotal: <strong>Rp {{ parseInt(subtotal).toLocaleString('id') }}</strong></p>
        <p>Diskon: <strong>Rp {{ parseInt(discount).toLocaleString('id') }}</strong></p>
        <p v-if="stateAPI.api?.rajaongkir">
          Ongkir: <strong>Rp {{
            parseInt(stateAPI.api.rajaongkir.results[0].costs[1].cost[0].value).toLocaleString('id')
          }}</strong>
        </p>
        <p>Total: <strong class="text-success">Rp {{ parseInt(totalPembayaran).toLocaleString('id') }}</strong></p>
      </div>

      <!-- Tombol Bayar -->
      <button @click="bayar" class="btn btn-success btn-lg w-100">Bayar Sekarang</button>
    </div>
  </div>
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import addressCRUD from "../modules/addressCRUD.js";
import productCRUD from "../modules/productCRUD.js";
import discountCRUD from "../modules/discountCRUD.js";
import wishlistCRUD from "../modules/wishlistCRUD.js";
import deliveryCRUD from "../modules/deliveryCRUD.js";
import orderCRUD from "../modules/orderCRUD.js";
import extAPI from "../modules/extAPI.js";
import axios from 'axios'
import { watchEffect } from "vue";
import  {onBeforeMount, ref}  from "vue";

export default {
  name: "checkoutWishlistUser",
  components: { navBarUser },
  setup() {
    const { stateAddress, getOneAddress } = addressCRUD();
    const { stateProduct, getAllProductMainWarehouse } = productCRUD();
    const { stateDiscount, getOneDiscount } = discountCRUD();
    const { stateWishlist, getOneWishlist, deleteWishlist } = wishlistCRUD();
    const { createDelivery } = deliveryCRUD();
    const { updateOrderDeliveryId } = orderCRUD();
    const { stateAPI, getOngkir } = extAPI();

    const discountCode = ref("");
    const qty = ref("");
    const subtotal = ref("");
    const tempdiscount = ref("");
    const discount = ref("");
    const totalPembayaran = ref("");
    const pick = ref(null);
    const defaultAddress = ref(null);

    const getProductPrice = (productID) => {
      if (!Array.isArray(stateProduct.product)) return 0;
      const product = stateProduct.product.find(p => p.id === productID);
      return product?.price || 0;
    };

    const handleDiscountClick = () => {
      sessionStorage.setItem('checkoutOrigin', '/checkoutWishlist');
    };

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ec6hh_RUrH6HLFTM");
    document.head.appendChild(script);

    onBeforeMount(() => {
      pick.value = 0;
      qty.value = sessionStorage.getItem("qty");
      stateAddress.newUsername = sessionStorage.getItem("username");
      getOneAddress(stateAddress.newUsername);
      getOneWishlist(sessionStorage.getItem("username"));
      getAllProductMainWarehouse();

      watchEffect(() => {
        if (stateAddress.address && stateAddress.address.cityID) {
          defaultAddress.value = stateAddress.address;
          getOngkir(defaultAddress.value.cityID);
        }
      });

      const storedDiscountCode = sessionStorage.getItem("discountCode");
      if (storedDiscountCode !== null) {
        discountCode.value = storedDiscountCode;
      }
      getOneDiscount(discountCode.value);

      watchEffect(() => {
        if (Array.isArray(stateProduct.product) && Array.isArray(stateWishlist.wishlist.items)) {
          let tempSubtotal = 0;
          stateWishlist.wishlist.items.forEach(item => {
            const product = stateProduct.product.find(p => p.id === item.productID);
            if (product) {
              tempSubtotal += product.price * item.quantity;
            }
          });
          subtotal.value = tempSubtotal;
        }

        if (stateDiscount.discount.data) {
          const disc = stateDiscount.discount.data;
          const percentage = (subtotal.value * disc.percentageDiscount) / 100;
          if (disc.fixedAmountDiscount !== 0 && disc.percentageDiscount === 0) {
            discount.value = disc.fixedAmountDiscount;
          } else if (disc.fixedAmountDiscount === 0 && disc.percentageDiscount !== 0) {
            discount.value = percentage;
          } else {
            discount.value = Math.min(percentage, disc.fixedAmountDiscount);
          }
        } else {
          discount.value = 0;
        }

        const ongkir = stateAPI.api?.rajaongkir?.results?.[0]?.costs?.[1]?.cost?.[0]?.value || 0;
        totalPembayaran.value = subtotal.value - discount.value + ongkir;
      });
    });

    const bayar = async () => {
      if (!Array.isArray(stateWishlist.wishlist.items) || stateWishlist.wishlist.items.length === 0) {
        alert("Wishlist tidak valid atau kosong.");
        return;
      }

      try {
        const username = sessionStorage.getItem("username");

        const wishlistItems = stateWishlist.wishlist.items.map(item => {
          const price = getProductPrice(item.productID);
          return {
            productId: item.productID,
            productName: item.productName,
            quantity: item.quantity,
            price,
            total: price * item.quantity
          };
        });

        const orderPayload = {
          username,
          items: wishlistItems,
          paymentMethod: pick.value,
          deliveryMethod: 1,
          discountCode: discountCode.value,
          totalPayment: totalPembayaran.value
        };

        const orderResult = await axios.post("https://bmp-inv-be.zenbytes.id/order/new", orderPayload, {
          headers: { "Content-type": "application/json" },
          credentials: "include"
        });

        const orderId = orderResult.data.order.id;
        const deliveryPayload = { orderId, ...defaultAddress.value };
        const delivery = await createDelivery(deliveryPayload);
        await updateOrderDeliveryId(orderId, delivery.id);

        if (pick.value === 0) {
          sessionStorage.removeItem('discountCode');
          await deleteWishlist(username);
          alert("Pembayaran diterima. Pesanan akan segera diproses.");
          window.location.href = '/paymentSuccess';
        } else {
          const midtransResponse = await axios.post('https://bmp-inv-be.zenbytes.id/midtrans/createTransaction', {
            order_id: orderId,
            gross_amount: orderResult.data.order.totalPayment,
            customer_details: {
              first_name: username,
              email: "test@example.com",
              phone: "08123456789"
            }
          });

          const token = midtransResponse.data.token;
          window.snap.pay(token, {
            onSuccess: async (result) => {
              await axios.put(`https://bmp-inv-be.zenbytes.id/order/updateStatusAfterPayment/${orderId}`);
              sessionStorage.removeItem("discountCode");
              await deleteWishlist(username);
              console.log("Payment Success:", result);
              window.location.href = "/paymentSuccess";
            },
            onPending: (result) => {
              console.log("Payment Pending:", result);
            },
            onError: (result) => {
              console.error("Payment Error:", result);
            }
          });
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Gagal memproses pembayaran");
      }
    };

    return {
      stateAddress,
      getOneAddress,
      stateProduct,
      getAllProductMainWarehouse,
      stateDiscount,
      getOneDiscount,
      stateWishlist,
      getOneWishlist,
      getOngkir,
      stateAPI,
      discountCode,
      qty,
      subtotal,
      tempdiscount,
      discount,
      totalPembayaran,
      pick,
      defaultAddress,
      getProductPrice,
      handleDiscountClick,
      deleteWishlist,
      bayar
    };
  }
};
</script>

<style lang="">
</style>