<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">{{item.id}}</h5>
                <p class="card-text">{{item.requester}}</p>
                <p class="card-text"  v-if="item.status === 0 ">status: Menunggu approval</p>
                <p class="card-text"  v-if="item.status === 1 ">status: sedang di proses</p>
                <p class="card-text"  v-if="item.status === 2 ">status: sedang di kirim</p>
                <p class="card-text"  v-if="item.status === 3 ">status: telah diterima</p>
            </div>
        </div>
    </div>
</template>
<script>
// import productCRUD from '../modules/productCRUD.js'
// import { onMounted } from 'vue'; 

export default {
  name: "cardCart",
  props: ['item']
};
</script>
<style lang="">
    
</style>