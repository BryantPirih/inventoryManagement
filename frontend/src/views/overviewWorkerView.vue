<template lang="">
    <div>
        <navBarInventory/>
    </div>

    <div class="row mb-3">
        <div class="col-md-4 mt-d" v-for="item in stateOrder.order" :key="item.name">
            <router-link :to="'/order/'+item.id"><cardOrderOverview :item="item"/> </router-link>
        </div>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import cardOrderOverview from "@/components/cardOrderOverview.vue";
import orderCRUD from "../modules/orderCRUD.js";
import { onMounted } from "vue";
export default {
    name: 'overviewWorker',
    components:{
        navBarInventory,
        cardOrderOverview
    },
    setup() {
    const { stateOrder, getAllOrder } = orderCRUD();

    onMounted(() => {
        getAllOrder();
    });

    return { stateOrder, getAllOrder };
  },
}
</script>
<style lang="">
    
</style>