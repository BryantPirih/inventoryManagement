<template>
  <div>
    <navBarUser />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Voucher Saya</h2>

      <div v-if="stateDiscount.discount && stateDiscount.discount.length">
        <div
          class="card mb-3 shadow-sm"
          v-for="item in stateDiscount.discount"
          :key="item._id"
        >
          <div class="card-body d-flex align-items-start">
            <input
              class="form-check-input me-3 mt-1"
              type="radio"
              :value="item.discountCode"
              v-model="selectedDiscount"
              @change="handleDiscountSelection(item.discountCode)"
            />

            <div>
              <h5 class="card-title mb-1">{{ item.name }}</h5>
              <p class="card-text text-muted mb-1">
                Belanja minimal Rp.{{ formatRupiah(item.minimumTransaction) }}
              </p>
              <p class="card-text text-success fw-semibold">
                {{ formatDiscountText(item) }}
              </p>
            </div>
          </div>
        </div>

        <button @click="apply" type="button" class="btn btn-success mt-3">
          Gunakan Voucher
        </button>
      </div>

      <div v-else>
        <p>Belum ada data.</p>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import discountCRUD from "../modules/discountCRUD.js";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "voucherUser",
  components: {
    navBarUser,
  },
  setup() {
    const { stateDiscount, getAllDiscount } = discountCRUD();
    const selectedDiscount = ref(null);
    const router = useRouter();

    const handleDiscountSelection = (discountCode) => {
      selectedDiscount.value = discountCode;
      console.log("Selected Discount Code:", discountCode);
    };

    const formatRupiah = (val) => {
  const parsed = parseInt(val || 0);
  return isNaN(parsed) ? "0" : parsed.toLocaleString("id-ID");
};

    const formatDiscountText = (item) => {
      const fixed = item.fixedAmountDiscount || 0;
      const percent = item.percentageDiscount || 0;

      if (item.discountType === 1) {
        return `Discount Rp.${formatRupiah(fixed)}`;
      } else if (item.discountType === 2) {
        return `Discount ${percent}%`;
      } else if (item.discountType === 3) {
        return `Discount ${percent}% hingga Rp.${formatRupiah(fixed)}`;
      } else {
        return "Discount tidak valid";
      }
    };


    const apply = () => {
      sessionStorage.setItem("discountCode", selectedDiscount.value);
      const origin = sessionStorage.getItem("checkoutOrigin") || "/checkoutUser";
      router.push(origin);
    };

    onBeforeMount(getAllDiscount);

    return {
      stateDiscount,
      selectedDiscount,
      handleDiscountSelection,
      formatRupiah,
      formatDiscountText,
      apply,
    };
  },
};
</script>