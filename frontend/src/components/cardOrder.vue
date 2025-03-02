<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">belanja {{item[0].orderDate}}</h5>
                <p class="card-text"  v-if="item[0].status === 0 ">status: sedang di proses </p>
                <p class="card-text"  v-else-if="item[0].status === 1 ">status: sedang dikirim </p>
                <p class="card-text"  v-else-if="item[0].status === 2 ">status: sudah sampai tujuan </p>
                <p class="card-text"  v-else> status: meunggu pembayaran </p>
                <p class="card-text">{{item[0].productName}}</p>
                <p class="card-text"> {{item[0].quantity}} barang Total belanja Rp. {{parseInt(item[0].totalPayment).toLocaleString('id')}}  </p>
            </div>
        </div>
    </div>
</template>
<script>


export default {
  name: "cardOrder",
  props: ['item']
};
</script>
<style lang="">
    
</style>