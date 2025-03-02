<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">{{item.recipientName}}</h5>
                <p class="card-text">+62{{item.recipientPhone}}</p>
                <p class="card-text">{{item.fullAddress}}, {{item.subDistrict}}, 
                    Kec. {{item.district}}, Kota {{item.city}}, {{item.province}}, {{item.postalCode}}, Indonesia</p>
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