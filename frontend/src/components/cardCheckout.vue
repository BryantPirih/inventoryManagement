<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">{{item.name}}</h5>
                <p>20 kg</p>
                <p>Rp. {{parseInt(item.price).toLocaleString('id') }} </p>
            </div>
        </div>
    </div>
</template>
<script>
// import productCRUD from '../modules/productCRUD.js'
// import { onMounted } from 'vue'; 

export default {
  name: "cardCheckout",
  props: ['item']
};
</script>
<style lang="">
    
</style>