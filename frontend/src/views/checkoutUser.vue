<template>
    <div>
      <navBarUser />
      <div class="container my-4">
        <h2 class="mb-4">Checkout</h2>

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

        <div class="card p-4 mb-4 shadow-sm" v-if="stateProduct.product.data">
          <h5 class="card-title">Ringkasan Produk</h5>
          <div>
            <p><strong>{{ stateProduct.product.data.name }}</strong></p>
            <p>Harga: Rp {{ parseInt(stateProduct.product.data.price).toLocaleString('id') }}</p>
            <p>Jumlah: {{ qty }}</p>
          </div>
        </div>

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
  
        <div class="card p-3 mb-4">
          <h5 class="card-title">Voucher</h5>
          <router-link :to="'/discountPage'" class="nav-link p-0" @click="handleDiscountClick">
            <button class="btn btn-outline-success">
              <i class="bi bi-percent"></i>
              {{ discountCode || "Klik untuk pakai diskon" }}
            </button>
          </router-link>
        </div>
  
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
import deliveryCRUD from "../modules/deliveryCRUD.js";
import orderCRUD from "../modules/orderCRUD.js";
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
    const { createDelivery } = deliveryCRUD();
    const { updateOrderDeliveryId } = orderCRUD();
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

    const handleDiscountClick = () => {
      sessionStorage.setItem("checkoutOrigin", "/checkoutUser");
    };

    onBeforeMount(() => {
        pick.value = 0; 
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
                  (subtotal.value * stateDiscount.discount.data.percentageDiscount) / 100;
              } else {
                tempdiscount.value =
                  (subtotal.value * stateDiscount.discount.data.percentageDiscount) / 100;
                if (
                  tempdiscount.value > stateDiscount.discount.data.fixedAmountDiscount
                ) {
                  discount.value = stateDiscount.discount.data.fixedAmountDiscount;
                } else {
                  discount.value = tempdiscount.value;
                }
              }
            } else {
              discount.value = 0;
            }

            if(stateAPI.api && stateAPI.api.rajaongkir){
                totalPembayaran.value = (subtotal.value - discount.value) + stateAPI.api.rajaongkir.results[0].costs[1].cost[0].value
            }
            
        });
    });

    const bayar = async () => {
      try {
        const quantity = parseInt(sessionStorage.getItem("qty"));

        // Step 1: Create order with price + total
        const orderPayload = {
          username: sessionStorage.getItem('username'),
          items: [{
            productId: stateProduct.product.data.id,
            productName: stateProduct.product.data.name,
            quantity,
            price: stateProduct.product.data.price,
            total: stateProduct.product.data.price * quantity
          }],
          paymentMethod: pick.value,
          deliveryMethod: 1,
          discountCode: discountCode.value,
          totalPayment: totalPembayaran.value
        };

        const orderResult = await axios.post("https://bmp-inv-be.zenbytes.id/order/new", orderPayload, {
          headers: { "Content-type": "application/json" },
          credentials: "include"
        });

        // Step 2: Create delivery from defaultAddress
        const orderId = orderResult.data.order.id;
        const deliveryPayload = {
          orderId,
          ...defaultAddress.value
        };

        
        const delivery = await createDelivery(deliveryPayload);

        // Step 3: Update order with deliveryId
        await updateOrderDeliveryId(orderId, delivery.id);

        // Step 4: Payment logic
        if (pick.value === 0) {
          alert("Pembayaran diterima. Pesanan akan segera diproses.");
          sessionStorage.removeItem('qty');
          sessionStorage.removeItem('barang');
          sessionStorage.removeItem('discountCode');
          window.location.href = '/paymentSuccess';
        } else {
          const response = await axios.post("https://bmp-inv-be.zenbytes.id/midtrans/createTransaction", {
            order_id: orderId,
            gross_amount: orderResult.data.order.totalPayment,
            customer_details: {
              first_name: sessionStorage.getItem("username"),
              email: "test@example.com",
              phone: "08123456789"
            }
          });

          const token = response.data.token;

          window.snap.pay(token, {
            onSuccess: async (paymentResult) => {
              await axios.put(`https://bmp-inv-be.zenbytes.id/order/updateStatusAfterPayment/${orderId}`);
              sessionStorage.removeItem("qty");
              sessionStorage.removeItem("barang");
              sessionStorage.removeItem("discountCode");
              console.log("Payment Success:", paymentResult);
              window.location.href = "/paymentSuccess";
            },
            onPending: (paymentResult) => {
              console.log("Payment Pending:", paymentResult);
            },
            onError: (paymentResult) => {
              console.error("Payment Error:", paymentResult);
            }
          });
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Gagal memproses pembayaran");
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
            bayar,
            handleDiscountClick
            };
  }
};
</script>
<style lang="">
</style>