<template>
    <div>
      <navBarUser />
      <div class="container my-4">
        <h2 class="mb-4">Checkout</h2>
        <!-- Address Section -->
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

        <!-- Product Section -->
        <div class="mb-4" v-if="stateProduct.product.data">
          <h5 class="mb-2">Pesanan</h5>
          <div class="border rounded p-3">
            <h6 class="mb-1">{{ stateProduct.product.data.name }}</h6>
            <div class="fw-bold mb-2">Rp {{ parseInt(stateProduct.product.data.price).toLocaleString('id') }}</div>
            <div><strong>Quantity:</strong> {{ qty }}</div>
          </div>
        </div>


        <!-- Payment Method -->
        <div class="card p-3 mb-4">
          <h5 class="card-title">Metode Pembayaran</h5>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              v-model="pick"
              :value="0"
              name="paymentMethod"
              id="cod"
            />
            <label class="form-check-label" for="cod">Cash On Delivery (COD)</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              v-model="pick"
              :value="1"
              name="paymentMethod"
              id="gateway"
            />
            <label class="form-check-label" for="gateway">Payment Gateway</label>
          </div>
        </div>
  
        <!-- Voucher -->
        <div class="card p-3 mb-4">
          <h5 class="card-title">Voucher</h5>
          <router-link :to="'/discountPage'" class="nav-link p-0">
            <button class="btn btn-outline-success">
              <i class="bi bi-percent"></i>
              {{ discountCode || "Klik untuk pakai diskon" }}
            </button>
          </router-link>
        </div>
  
        <!-- Summary -->
        <div class="card p-3 mb-4">
          <h5 class="card-title">Ringkasan Pembayaran</h5>
          <p>Subtotal Product: <strong>Rp {{ parseInt(subtotal).toLocaleString('id') }}</strong></p>
          <p>Diskon Product: <strong>Rp {{ parseInt(discount).toLocaleString('id') }}</strong></p>
          <p v-if="stateAPI.api && stateAPI.api.rajaongkir">
            Biaya Pengiriman: <strong>Rp {{
              parseInt(stateAPI.api.rajaongkir.results[0].costs[1].cost[0].value).toLocaleString('id')
            }}</strong>
          </p>
          <p>Total Pembayaran: <strong class="text-success">Rp {{ parseInt(totalPembayaran).toLocaleString('id') }}</strong></p>
        </div>
  
        <button @click="bayar" class="btn btn-success btn-lg w-100">Bayar</button>
      </div>
    </div>
  </template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import addressCRUD from "../modules/addressCRUD.js";
import productCRUD from "../modules/productCRUD.js";
import discountCRUD from "../modules/discountCRUD.js";
import extAPI from "../modules/extAPI.js";
import axios from 'axios'
import { watchEffect } from "vue";
import  {onBeforeMount, ref}  from "vue";
export default {
  name: "checkoutUser",
  components: {
    navBarUser,
  },
  setup() {
    const { stateAddress, getOneAddress } = addressCRUD();
    const { stateProduct, getOneProductMainWarehouse } = productCRUD();
    const { stateDiscount, getOneDiscount } = discountCRUD();
    const { stateAPI, getOngkir } = extAPI();
    const discountCode = ref("")
    const qty = ref("")
    const subtotal = ref("")
    const tempdiscount = ref("")
    const discount = ref("")
    const totalPembayaran = ref("")
    const pick = ref(null)
    const defaultAddress = ref(null);

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ec6hh_RUrH6HLFTM");
    document.head.appendChild(script);

    onBeforeMount(() => {
        qty.value = sessionStorage.getItem("qty")
        stateAddress.newUsername = sessionStorage.getItem("username");
        getOneAddress(stateAddress.newUsername);
        watchEffect(() => {
          if (stateAddress.address && stateAddress.address.cityID) {
            defaultAddress.value = stateAddress.address;
            getOngkir(defaultAddress.value.cityID);
          }
        });

        getOneProductMainWarehouse(sessionStorage.getItem("barang"));
        getOngkir();
        const storedDiscountCode = sessionStorage.getItem("discountCode");
        if(storedDiscountCode !== null){
            discountCode.value = storedDiscountCode;
        }
        getOneDiscount(discountCode.value);
        watchEffect(() => {
            if (stateProduct.product.data && qty.value) {
            subtotal.value = stateProduct.product.data.price * qty.value;
            }

            if (stateDiscount.discount.data) {
                if (
                    stateDiscount.discount.data.fixedAmountDiscount !== 0 &&
                    stateDiscount.discount.data.percentageDiscount === 0
                ) {
                    discount.value = stateDiscount.discount.data.fixedAmountDiscount;
                } else if (
                    stateDiscount.discount.data.fixedAmountDiscount === 0 &&
                    stateDiscount.discount.data.percentageDiscount !== 0
                ) {
                    discount.value =
                    (subtotal.value * stateDiscount.discount.data.percentageDiscount) /
                    100;
                } else {
                    tempdiscount.value =
                    (subtotal.value * stateDiscount.discount.data.percentageDiscount) /
                    100;
                    if (
                    tempdiscount.value >
                    stateDiscount.discount.data.fixedAmountDiscount
                    ) {
                        discount.value = stateDiscount.discount.data.fixedAmountDiscount;
                    } else {
                        discount.value = tempdiscount.value;
                    }
                }
            }
            if(stateAPI.api && stateAPI.api.rajaongkir){
                totalPembayaran.value = (subtotal.value - discount.value) + stateAPI.api.rajaongkir.results[0].costs[1].cost[0].value
            }
            
        });
    });

    const bayar = async () => {
      try {
        // Prepare the order payload
        const orderPayload = {
          username: sessionStorage.getItem('username'),
          items: [{
            productId: stateProduct.product.data.id,  // Use product id from state
            productName: stateProduct.product.data.name,  // Use product name from state
            quantity: sessionStorage.getItem('qty')  // Use quantity from session storage
          }],
          paymentMethod: pick.value,
          deliveryMethod: 1,
          discountCode: discountCode.value,
          totalPayment: totalPembayaran.value
        };

        // Create the order
        const orderResult = await axios.post('http://localhost:3000/order/new', orderPayload, {
          headers: { 'Content-type': 'application/json' },
          credentials: 'include'
        });

        if (orderResult.status === 201) {
          if (pick.value === 0) {
            // For COD, the order status is set to 1 in the backend, so we just need to handle the redirect
            alert("Pembayaran diterima. Pesanan akan segera diproses.");
            sessionStorage.removeItem('qty');
            sessionStorage.removeItem('barang');
            sessionStorage.removeItem('discountCode');
            window.location.href = '/paymentSuccess';  // Redirect after COD
          } else {
            // For Payment Gateway, send to Midtrans for payment
            const response = await axios.post('http://localhost:3000/midtrans/createTransaction', {
              order_id: orderResult.data.order.id,
              gross_amount: orderResult.data.order.totalPayment,
              customer_details: {
                first_name: sessionStorage.getItem('username'), // Pass username as first name
                email: "test@example.com", // Optional: Fetch real email if available
                phone: "08123456789" // Optional: Fetch real phone if available
              }
            });

            const token = response.data.token;

            // Trigger the Snap payment popup
            window.snap.pay(token, {
              onSuccess: async (paymentResult) => {
                await axios.put(`http://localhost:3000/order/updateStatusAfterPayment/${orderResult.data.order.id}`);
                sessionStorage.removeItem('qty');
                sessionStorage.removeItem('barang');
                sessionStorage.removeItem('discountCode');
                console.log('Payment Success:', paymentResult);
                window.location.href = '/paymentSuccess';  // Redirect after payment success
              },
              onPending: (paymentResult) => {
                console.log('Payment Pending:', paymentResult);
              },
              onError: (paymentResult) => {
                console.error('Payment Error:', paymentResult);
              }
            });
          }
        } else {
          alert(orderResult.data.message);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Gagal memproses pembayaran');
      }
    };



    return { stateAddress, 
            getOneAddress, 
            stateProduct,
            getOneProductMainWarehouse,
            stateDiscount,
            getOneDiscount,
            getOngkir,
            stateAPI,
            discountCode,
            qty,
            subtotal,
            tempdiscount,
            discount,
            totalPembayaran,
            defaultAddress,
            pick,
            bayar
            };
  }
};
</script>
<style lang="">
</style>