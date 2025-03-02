<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>checkout</h2>
    <br>
    <div class="col mb-3">
        alamat Pengiriman
        <div v-if="stateAddress.address.data != null">
            <div class="row-md-4 mt-d" v-for="item in stateAddress.address" :key="item.id">
                <cardAddress :item="item"/>
            </div>
        </div>
        <div v-else>
            blom ada alamat pengiriman
        </div>
    </div>
    <div class="col mb-3">
        Pesanan 
        <div class="row-md-4 mt-d" v-for="item in stateProduct.product" :key="item.name">
            <cardCheckout :item="item"/>
        </div>
        quantity : {{qty}}
    </div>
    
    <div class="col mb-3">
        Metode Pembayaran<br>
        <input type="radio" v-model="pick" :value="0" name="metodePembayaran" />
        <label for="COD">Cash On Delivery (COD) </label> <br>
        <input type="radio" v-model="pick" :value="1" name="metodePembayaran"/>
        <label for="COD">Payment Gateway</label><br>
    </div>

    <div class="col mb-3">
        Voucher
        <router-link v-if="discountCode === '' " to="/discountPage" class="nav-link">
            <button class="btn btn-outline-success" type="submit"><i class="bi bi-percent"></i>
                Klik untuk pakai diskon
            </button>
        </router-link>
        <router-link v-else to="/discountPage" class="nav-link">
            <button class="btn btn-outline-success" type="submit"><i class="bi bi-percent"></i>
                {{discountCode}}
            </button>
        </router-link>
    </div>

    <div class="col mb-3">
        <label>Ringkasan Pembayaran</label><br>
        <!-- <div class="row-md-4 mt-d" v-for="item in stateProduct.product" :key="item.name">
            <cardCheckout :item="item"/>
        </div> -->
        <label v-if="subtotal"> 
            Subtotal Product:  Rp.{{parseInt(subtotal).toLocaleString('id')}}
        </label> <br>
        <label> Diskon Product Rp. {{parseInt(discount).toLocaleString('id')}}</label> <br>
        <label v-if="stateAPI.api && stateAPI.api.rajaongkir"> Biaya Pengiriman Rp. 
            {{parseInt(stateAPI.api.rajaongkir.results[0].costs[1].cost[0].value).toLocaleString('id')}}</label><br>
        <label> Total Pembayaran Rp. {{parseInt(totalPembayaran).toLocaleString('id')}}</label> <br>
        
    </div>

    <button @click="bayar()" type="button" class="btn btn-success">Bayar</button>

</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardAddress from "@/components/cardAddress.vue";
import cardCheckout from "@/components/cardCheckout.vue";
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
    cardAddress,
    cardCheckout
  },
  setup() {
    const { stateAddress, getOneAddress } = addressCRUD();
    const { stateProduct, getOneProduct } = productCRUD();
    const { stateDiscount, getOneDiscount } = discountCRUD();
    const { stateAPI, getOngkir } = extAPI();
    const discountCode = ref("")
    const qty = ref("")
    const subtotal = ref("")
    const tempdiscount = ref("")
    const discount = ref("")
    const totalPembayaran = ref("")
    const pick = ref(null)

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ec6hh_RUrH6HLFTM");
    document.head.appendChild(script);

    onBeforeMount(() => {
        qty.value = sessionStorage.getItem("qty")
        stateAddress.newUsername = sessionStorage.getItem("username");
        getOneAddress(stateAddress.newUsername);
        getOneProduct(sessionStorage.getItem("barang"));
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
                if (pick.value === 0) {
                    let result = await axios.post("http://localhost:3000/order/new", {
                        headers: { 'Content-type': 'application/json' },
                        credentials: 'include',
                        username: sessionStorage.getItem('username'),
                        productId: stateProduct.product.data.id,
                        productName: stateProduct.product.data.name,
                        paymentMethod: pick.value,
                        deliveryMethod: 1,
                        quantity: sessionStorage.getItem('qty'),
                        discountCode: discountCode.value,
                        totalPayment: totalPembayaran.value,
                        status: 0
                    });
                    if (result.status === 200) {
                        alert("pembayaran diterima pesanan akan segera di proses")
                        sessionStorage.removeItem('qty')
                        sessionStorage.removeItem('barang')
                        sessionStorage.removeItem('discountCode')
                    } else {
                        alert(result.data.message);
                    }

                }else {
                    try {
                        let result = await axios.post("http://localhost:3000/order/new", {
                            headers: { 'Content-type': 'application/json' },
                            credentials: 'include',
                            username: sessionStorage.getItem('username'),
                            productId: stateProduct.product.data.id,
                            productName: stateProduct.product.data.name,
                            paymentMethod: pick.value,
                            deliveryMethod: 1,
                            quantity: sessionStorage.getItem('qty'),
                            discountCode: discountCode.value,
                            totalPayment: totalPembayaran.value,
                            status: 0
                        });
                        
                        const response = await axios.post('http://localhost:3000/midtrans/createTransaction', {
                            order_id: result.data.order.id,
                            gross_amount: result.data.order.totalPayment,
                            customer_details: result.data.order.username,
                        });
                        const token = response.data.token;
                        // Trigger the Snap payment popup
                        window.snap.pay(token, {
                        onSuccess: (result) => {
                            sessionStorage.removeItem('qty')
                            sessionStorage.removeItem('barang')
                            sessionStorage.removeItem('discountCode')
                            console.log('Payment Success:', result);
                        },
                        onPending: (result) => {
                            console.log('Payment Pending:', result);
                        },
                        onError: (result) => {
                            console.error('Payment Error:', result);
                        },
                        });

                    } catch (error) {
                        console.error('Error creating transaction:', error);
                    }
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    alert('Incorrect password');
                } else {
                    alert('Credentials not found');
                }
            }
        };


    return { stateAddress, 
            getOneAddress, 
            stateProduct,
            getOneProduct,
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
            pick,
            bayar
            };
  }
};
</script>
<style lang="">
</style>