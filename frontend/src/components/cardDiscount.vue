<template>
  <div
    class="border rounded shadow-sm p-3 mb-3 d-flex align-items-start bg-white"
    :class="{ 'border-success': selectedDiscount === item.discountCode }"
  >
    <input
      type="radio"
      v-model="selectedDiscount"
      :value="item.discountCode"
      name="voucherSelection"
      class="form-check-input me-3 mt-1"
      @change="selectDiscount"
    />

    <div>
      <h5 class="mb-1">{{ item.name }}</h5>

      <div class="text-muted small mb-1">
        Belanja minimal Rp.{{ parseInt(item.minimumTransaction).toLocaleString('id') }}
      </div>

      <div class="fw-semibold text-success">
        <template v-if="item.fixedAmountDiscount && item.percentageDiscount === 0">
          Discount Rp.{{ parseInt(item.fixedAmountDiscount).toLocaleString('id') }}
        </template>

        <template v-else-if="item.fixedAmountDiscount === 0 && item.percentageDiscount">
          Discount {{ parseInt(item.percentageDiscount).toLocaleString('id') }}%
        </template>

        <template v-else>
          Discount {{ parseInt(item.percentageDiscount).toLocaleString('id') }}% hingga Rp.{{ parseInt(item.fixedAmountDiscount).toLocaleString('id') }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cardDiscount",
  props: ['item'],
  data() {
    return {
      selectedDiscount: null,
    };
  },
  methods: {
    selectDiscount() {
      this.$emit("discount-selected", this.selectedDiscount);
    },
  },
};
</script>

<style scoped>
/* Optional: add hover effect */
.border:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}
</style>