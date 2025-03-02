<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">{{item.item[0].productName}}</h5>
                <p class="card-text">{{item.item[0].qty}}</p>
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