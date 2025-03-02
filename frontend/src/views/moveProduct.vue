<template lang="">
    <div>
        <navBarInventory/>
        <div class="newProducts">
            <router-link to="/newMove" class="nav-link">
                <button class="btnNewProducts btn btn-success">request</button>
            </router-link>
            <h5 class="products">Move</h5>
        </div>
    </div>

    <div class="row mb-3">
        <div class="col-md-4 mt-d" v-for="item in stateMove.move" :key="item.id">
            <router-link :to="'/move/'+item.id"><cardMove :item="item"/> </router-link>
        </div>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import cardMove from "@/components/cardMove.vue";
import moveCRUD from "../modules/moveCRUD.js";
import { onBeforeMount } from "vue";
export default {
    name: 'moveProduct',
    components:{
        navBarInventory,
        cardMove
    },
    setup() {
    const { stateMove, getAllMove } = moveCRUD();

    onBeforeMount(() => {
        getAllMove();
    });

    return { stateMove, getAllMove };
  },
}
</script>
<style lang="">
    
</style>