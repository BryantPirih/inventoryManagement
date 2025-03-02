<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>Voucher saya</h2> 

    <div class="col mb-3" v-if="stateDiscount.discount != null">
        <div class="row-md-4 mt-d" v-for="item in stateDiscount.discount" :key="item.id">
            <cardDiscount :item="item" @discount-selected="handleDiscountSelection"/>
        </div>
    </div>

    <div v-else>
      blom ada data
    </div>
    <button @click="apply" type="button" class="btn btn-success">Gunakan Voucher</button>
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardDiscount from "@/components/cardDiscount.vue";
import discountCRUD from "../modules/discountCRUD.js";
import  {onBeforeMount, ref}  from "vue";
import {useRouter} from 'vue-router'
export default {
  name: "wishlistUser",
  components: {
    navBarUser,
    cardDiscount
  },
  setup() {

    const { stateDiscount, getAllDiscount } = discountCRUD();
    const selectedDiscount = ref(null); // Track the selected discount code
    const router = useRouter()

    const handleDiscountSelection = (discountCode) => {
      selectedDiscount.value = discountCode; // Update the selected discount
      console.log("Selected Discount Code:", discountCode);
    };
    onBeforeMount(() => {
      getAllDiscount();
    });
    const apply = () =>{
        sessionStorage.setItem('discountCode',selectedDiscount.value)
        router.push({name:'checkoutUser'})
    }
    return { stateDiscount, 
        getAllDiscount,
        selectedDiscount,
        handleDiscountSelection,
        apply};
  }
};
</script>
<style lang="">
</style>