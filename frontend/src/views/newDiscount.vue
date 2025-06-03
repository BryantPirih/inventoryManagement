<template>
  <div>
    <navBarInventory />

    <div class="container mt-4">
      <h3 class="fw-bold mb-4">Create New Discount</h3>

      <form @submit.prevent="validateAndSubmit">
        <div class="mb-3">
          <label class="form-label">Discount Name</label>
          <input type="text" class="form-control" required v-model="stateDiscount.newNameDiscount" />
        </div>

        <div class="mb-3">
          <label class="form-label">Discount Code</label>
          <input type="text" class="form-control" required v-model="stateDiscount.newDiscountCode" />
        </div>

        <div class="mb-3">
          <label class="form-label">Payment Method</label>
          <select class="form-select" v-model="stateDiscount.newPaymentMethod" required>
            <option value="1">Cash on Delivery (COD)</option>
            <option value="2">Payment Gateway</option>
            <option value="3">Semua</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Discount Type</label>
          <select class="form-select" v-model="stateDiscount.newDiscountType" required>
            <option value="1">Fixed Amount</option>
            <option value="2">Percentage</option>
            <option value="3">Semua</option>
          </select>
        </div>

        <div class="mb-3" v-if="stateDiscount.newDiscountType == '1' || stateDiscount.newDiscountType == '3'">
          <label class="form-label">Fixed Amount</label>
          <input type="number" class="form-control" v-model="stateDiscount.newFixedAmountDiscount" />
        </div>

        <div class="mb-3" v-if="stateDiscount.newDiscountType == '2' || stateDiscount.newDiscountType == '3'">
          <label class="form-label">Percentage</label>
          <input type="number" class="form-control" v-model="stateDiscount.newPercentageDiscount" />
        </div>

        <div class="mb-3">
          <label class="form-label">Discount Start Date</label>
          <VueDatePicker v-model="stateDiscount.newDiscountStart" class="w-100" />
        </div>

        <div class="mb-3">
          <label class="form-label">Discount End Date</label>
          <VueDatePicker v-model="stateDiscount.newDiscountEnd" class="w-100" />
        </div>

        <div class="mb-3">
          <label class="form-label">Minimum Transaction</label>
          <input type="number" class="form-control" v-model="stateDiscount.newMinimumTransaction" />
        </div>

        <div class="mb-3">
          <label class="form-label">Usage Limit</label>
          <input type="number" class="form-control" v-model="stateDiscount.newUsageLimit" />
        </div>

        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import discountCRUD from '../modules/discountCRUD'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export default {
  name: "newDiscount",
  components: {
    navBarInventory,
    VueDatePicker
  },
  setup() {
    const { stateDiscount, newDiscount } = discountCRUD()
    const router = useRouter()

    const validateAndSubmit = async () => {
      const s = stateDiscount
      if (
        !s.newNameDiscount || !s.newDiscountCode || !s.newPaymentMethod ||
        !s.newDiscountType || !s.newDiscountStart || !s.newDiscountEnd ||
        !s.newMinimumTransaction || !s.newUsageLimit ||
        (s.newDiscountType === '1' && !s.newFixedAmountDiscount) ||
        (s.newDiscountType === '2' && !s.newPercentageDiscount) ||
        (s.newDiscountType === '3' && (!s.newFixedAmountDiscount || !s.newPercentageDiscount))
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Gagal',
          text: 'Semua field wajib diisi sesuai jenis diskon yang dipilih.'
        })
        return
      }

      try {
        const success = await newDiscount()
        if (success) {
          await Swal.fire({
            icon: 'success',
            title: 'Sukses',
            text: 'Diskon berhasil dibuat!'
          })
          router.push('/discountOverview')
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal membuat diskon.'
          })
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan saat menyimpan diskon.'
        })
      }
    }

    return { stateDiscount, validateAndSubmit }
  }
}
</script>
