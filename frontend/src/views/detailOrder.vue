<template lang="">
    <div>
        <navBarInventory/>
    </div>

    <body>  
        <div class="col-md-6" v-if="stateOrder.order && stateOrder.order.data">
            <h2> Detail order</h2>
            <h2><strong>{{stateOrder.order.data.id}}</strong></h2>
            <hr>
            <h4> Pembeli : {{stateOrder.order.data.username}}</h4>
            <h4> Product Id : {{stateOrder.order.data.productId}}</h4>
            <h4> Product Name : {{stateOrder.order.data.productName}}</h4>
            <h4> Quantity : {{stateOrder.order.data.quantity}}</h4>
            <h4> Total Payment : Rp.{{parseInt(stateOrder.order.data.totalPayment).toLocaleString('id')}}</h4>
            <h4 class="card-text"  v-if="stateOrder.order.data.deliveryMethod === 0 ">deliveryMethod: pengambilan ditempat </h4>
            <h4 class="card-text"  v-else> Delivery Method: Delivery </h4>
            <h4 class="card-text"  v-if="stateOrder.order.data.status === 0 ">status: sedang di proses </h4>
            <h4 class="card-text"  v-else-if="stateOrder.order.data.status === 1 ">status: sedang dikirim </h4>
            <h4 class="card-text"  v-else-if="stateOrder.order.data.status === 2 ">status: sudah sampai tujuan </h4>
            <h4 class="card-text"  v-else> status: meunggu pembayaran </h4>
            <button @click="updateOrder(stateOrder.order.data.id,stateOrder.order.data.status)" >Update status</button>
        </div>
    </body>


</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import orderCRUD from "../modules/orderCRUD.js";
import { onBeforeMount} from "vue";
import { useRoute } from "vue-router";
export default {
  name: "detailOrder",
  components: {
    navBarInventory,
  },
  setup() {
    const {stateOrder , getOneOrder, updateOrder} = orderCRUD();
    let route = useRoute();

    onBeforeMount(() => {
        getOneOrder(route.params.id);
    });

    return {stateOrder,
        getOneOrder,
        updateOrder
    }
  },
};
</script>
<style lang="">
</style>