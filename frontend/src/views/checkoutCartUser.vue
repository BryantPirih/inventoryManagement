<template>
  <div>
    <navBarUser />
    <div class="container my-4">
      <h2 class="mb-4">Checkout Keranjang</h2>
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
        <div v-if="stateCart.cart.data && stateProduct.product">
          <div v-for="cartItem in stateCart.cart.data.item" :key="cartItem.id" class="mb-3">
            <p><strong>{{ cartItem.productName }}</strong></p>
            <p>Harga: Rp {{ parseInt(getProductPrice(cartItem.productID)).toLocaleString('id') }}</p>
            <p>Jumlah: {{ cartItem.qty }}</p>
          </div>
        </div>
        <div v-else class="text-muted">Tidak ada produk dalam keranjang.</div>
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
import cartCRUD from "../modules/cartCRUD.js";
import extAPI from "../modules/extAPI.js";
import axios from 'axios'
import { watchEffect } from "vue";
import  {onBeforeMount, ref}  from "vue";
export default {
  name: "checkoutCartUser",
  components: {
    navBarUser,
  },
  setup() {
    const { stateAddress, getOneAddress } = addressCRUD();
    const { stateProduct, getAllProductMainWarehouse } = productCRUD();
    const { stateDiscount, getOneDiscount } = discountCRUD();
    const { stateCart, getOneCart , deleteCart } = cartCRUD();
    const { stateAPI, getOngkir } = extAPI();
    const discountCode = ref("")
    const qty = ref("")
    const subtotal = ref("")
    const tempdiscount = ref("")
    const discount = ref("")
    const totalPembayaran = ref("")
    const pick = ref(null)
    const defaultAddress = ref(null);

    const getProductPrice = (productID) => {
      if (!Array.isArray(stateProduct.product)) return 0;
      const product = stateProduct.product.find(p => p.id === productID);
      return product?.price || 0;
    };

    const handleDiscountClick = () => {
      sessionStorage.setItem('checkoutOrigin', '/checkoutCart');
    };

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ec6hh_RUrH6HLFTM");
    document.head.appendChild(script);

    onBeforeMount(() => {
        qty.value = sessionStorage.getItem("qty")
        stateAddress.newUsername = sessionStorage.getItem("username");
        getOneAddress(stateAddress.newUsername);
        
        getOneCart(sessionStorage.getItem("username"));
        watchEffect(() => {
          if (stateAddress.address && stateAddress.address.cityID) {
            defaultAddress.value = stateAddress.address;
            getOngkir(defaultAddress.value.cityID);
          }
        });


        getAllProductMainWarehouse();
        const storedDiscountCode = sessionStorage.getItem("discountCode");
        if(storedDiscountCode !== null){
            discountCode.value = storedDiscountCode;
        }
        getOneDiscount(discountCode.value);
        watchEffect(() => {
          // Ensure products and cart are ready
          if (Array.isArray(stateProduct.product) && stateCart.cart.data?.item) {
            let tempSubtotal = 0;
            stateCart.cart.data.item.forEach(item => {
              const product = stateProduct.product.find(p => p.id === item.productID);
              if (product) {
                tempSubtotal += product.price * item.qty;
              }
            });
            subtotal.value = tempSubtotal;
          }

          // Handle discount logic
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

          // If ongkir not available yet, fallback to 0
          const ongkir = stateAPI.api?.rajaongkir?.results?.[0]?.costs?.[1]?.cost?.[0]?.value || 0;

          totalPembayaran.value = subtotal.value - discount.value + ongkir;
        });
    });

    const bayar = async () => {
      if (!stateCart.cart?.data?.item || !Array.isArray(stateCart.cart.data.item)) {
        alert("Keranjang tidak valid atau kosong.");
        return;
      }

      try {
        const username = sessionStorage.getItem('username');
        const cartItems = stateCart.cart.data.item.map(item => ({
          productId: item.productID,
          productName: item.productName,
          quantity: item.qty
        }));

        const orderPayload = {
          username: username,
          items: cartItems,
          paymentMethod: pick.value,
          deliveryMethod: 1,
          discountCode: discountCode.value,
          totalPayment: totalPembayaran.value
        };

        const orderResult = await axios.post("http://localhost:3000/order/new", orderPayload, {
          headers: { 'Content-type': 'application/json' },
          credentials: 'include'
        });

        if (pick.value === 0) {
          // Cash / COD
          if (orderResult.status === 201) {
            sessionStorage.removeItem('discountCode');
            await cartCRUD().deleteCart(username);  
            alert("Pembayaran diterima. Pesanan akan segera diproses.");
            window.location.href = '/paymentSuccess';  
          } else {
            alert(orderResult.data.message);
          }
        } else {
          // Midtrans Online Payment
          const midtransResponse = await axios.post('http://localhost:3000/midtrans/createTransaction', {
            order_id: orderResult.data.order.id,
            gross_amount: orderResult.data.order.totalPayment,
            customer_details: {
              first_name: username, // or fetch from your user DB
              email: "test@example.com",
              phone: "08123456789"
            }
          });

          const token = midtransResponse.data.token;
          window.snap.pay(token, {
            onSuccess: async (result) => {
              await axios.put(`http://localhost:3000/order/updateStatusAfterPayment/${orderResult.data.order.id}`);
              sessionStorage.removeItem('discountCode');
              await cartCRUD().deleteCart(username);  // Delete cart
              console.log('Payment Success:', result);
              window.location.href = '/paymentSuccess';
            },
            onPending: (result) => {
              console.log('Payment Pending:', result);
            },
            onError: (result) => {
              console.error('Payment Error:', result);
            }
          });
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Gagal memproses pembayaran');
      }
    };



    return { stateAddress, 
            getOneAddress, 
            stateProduct,
            getAllProductMainWarehouse,
            stateDiscount,
            getOneDiscount,
            stateCart,
            getOneCart,
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
            deleteCart,
            bayar
            };
  }
};
</script>
<style lang="">
</style>