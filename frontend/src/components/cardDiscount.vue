<template lang="">
    <div>
        <div class="card shadow">
            <div class="card-body">
                <input type="radio" v-model="selectedDiscount" :value="item.discountCode" name="metodePembayaran" @change="selectDiscount">

                <h5 class="card-title">{{item.name}}</h5>

                <p class="card-text">Belanja minimal Rp.{{parseInt(item.minimumTransaction).toLocaleString('id')}}</p>

                <p v-if="item.fixedAmountDiscount != null && item.percentageDiscount === 0" class="card-text">
                    Discount Rp.{{parseInt(item.fixedAmountDiscount).toLocaleString('id')}}
                </p>

                <p v-else-if="item.fixedAmountDiscount === 0 && item.percentageDiscount != 0" class="card-text">
                    Discount {{parseInt(item.percentageDiscount).toLocaleString('id')}}% 
                </p>

                <p v-else class="card-text">
                    Discount {{parseInt(item.percentageDiscount).toLocaleString('id')}}% Hingga Rp.{{parseInt(item.fixedAmountDiscount).toLocaleString('id')}}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "cardProduct",
  props: ['item'],
  data() {
    return {
      selectedDiscount: null, // Track the selected discount locally
    };
  },
  methods: {
    selectDiscount() {
      this.$emit("discount-selected", this.selectedDiscount); // Emit the selected discount to the parent
    },
  },
};
</script>
<style lang="">
    
</style>