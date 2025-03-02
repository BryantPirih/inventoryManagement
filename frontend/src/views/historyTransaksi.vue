<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>daftar transaksi</h2>
    <div class="col mb-3" v-if="stateOrder.order.data != null">
        <div class="row-md-4 mt-d" v-for="item in stateOrder.order" :key="item.id">
            <cardOrder :item="item"/>
        </div>
    </div>
    <div v-else>
      masih kosong
    </div>
    
    
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardOrder from "@/components/cardOrder.vue";
import orderCRUD from "../modules/orderCRUD.js";
import  {onBeforeMount}  from "vue";
export default {
  name: "historyTransaksi",
  components: {
    navBarUser,
    cardOrder
  },
  setup() {

    const { stateOrder, getAllOrderUser } = orderCRUD();

    onBeforeMount(() => {
      getAllOrderUser(sessionStorage.getItem("username"));
    });
    return { stateOrder, getAllOrderUser };

  }
};
</script>
<style lang="">
</style>