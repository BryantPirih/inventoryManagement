<template lang="">
    <div>
        <div class="card shadow">
            <div class="card-body">
                <h5 class="card-title">{{item.id}}</h5>
                <p class="card-text"  v-if="item.status === 0 ">status: sedang di proses </p>
                <p class="card-text"  v-else-if="item.status === 1 ">status: sedang dikirim </p>
                <p class="card-text"  v-else-if="item.status === 2 ">status: sudah sampai tujuan </p>
                <p class="card-text"  v-else> status: meunggu pembayaran </p>
            </div>
        </div>
    </div>
</template>
<script>
// import productCRUD from '../modules/productCRUD.js'
// import { onMounted } from 'vue'; 

export default {
  name: "cardProduct",
  props: ['item']
};
</script>
<style lang="">
    
</style>