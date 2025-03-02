<template lang="">
    <div>
        <navBarInventory/>
    </div>

    <body> 
        <div class="col-md-6" v-if="stateMove.move && stateMove.move.data && stateMove.moveProduct && stateMove.moveProduct.data ">
            <h2> Detail move</h2>
            <h2><strong>{{stateMove.move.data.id}}</strong></h2>
            <hr>
            <h4> request : {{stateMove.move.data.requester}}</h4>
            <h4> Approver : {{stateMove.move.data.approver}}</h4>
            <h4> from : {{stateMove.move.data.from}}</h4>
            <h4> to : {{stateMove.move.data.to}}</h4>
            <h4 v-if="stateMove.move.data.status === 0 "> status : Menunggu approval</h4>
            <h4 v-if="stateMove.move.data.status === 1 "> status : sedang di proses</h4>
            <h4 v-if="stateMove.move.data.status === 2 "> status : sedang di kirim</h4>
            <h4 v-if="stateMove.move.data.status === 3 "> status : telah di terima</h4>
            <h4> product : {{stateMove.moveProduct.data.productId}}</h4>
            <h4> quantity : {{stateMove.moveProduct.data.quantity}}</h4>
            <button @click="updateMove(stateMove.move.data.id,stateMove.move.data.status,approver)" >Update status</button>
        </div>
    </body>


</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import moveCRUD from "../modules/moveCRUD.js";
import { onBeforeMount, watch} from "vue";
import { useRoute } from "vue-router";
export default {
  name: "detailOrder",
  components: {
    navBarInventory,
  },
  setup() {
    const {stateMove , getOneMove,getOneMoveProduct,updateMove} = moveCRUD();
    let route = useRoute();
    let approver = sessionStorage.getItem('username')
    onBeforeMount(() => {
        getOneMove(route.params.id);
    });
    watch(
        () => stateMove.move, // Watch the specific property
        (newVal) => {
            if (newVal && newVal.data) {
                
                getOneMoveProduct(newVal.data.id);
            }
        }
    );

    return {stateMove,
        getOneMove,
        getOneMoveProduct,
        updateMove,
        approver
    }
  },
};
</script>
<style lang="">
</style>