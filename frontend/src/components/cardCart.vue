<template>
  <div>
    <div class="card shadow">
      <div class="card-body">
        <h5 class="card-title">{{ item.productName }}</h5>
        <p class="card-text">Quantity: {{ item.qty }}</p>
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