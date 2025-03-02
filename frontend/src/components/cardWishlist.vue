<template lang="">
    <div>
        <div class="card shadow">
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class="card-body">
                <h5 class="card-title">{{item.item[0].productName}}</h5>
            </div>
        </div>
    </div>
</template>
<script>
// import productCRUD from '../modules/productCRUD.js'
// import { onMounted } from 'vue'; 

export default {
  name: "cardWishlist",
  props: ['item']
};
</script>
<style lang="">
    
</style>