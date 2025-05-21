<template>
  <div>
    <navBarInventory />

    <div class="container py-5">
      <h3 class="fw-bold mb-4">Request Stock Transfer</h3>

      <form @submit.prevent="newMove">
        <div
          v-for="(item, index) in stateMove.products"
          :key="index"
          class="mb-4 border rounded p-3 bg-light"
        >
          <h6 class="fw-semibold mb-3">Product #{{ index + 1 }}</h6>

          <div class="mb-3">
            <label class="form-label">Product</label>
            <select class="form-select" v-model="item.productId" required>
              <option disabled value="">Select Product</option>
              <option v-for="p in stateProduct.product" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" v-model="item.quantity" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Unit Price (Harga Jual)</label>
            <input type="number" class="form-control" v-model="item.unitPrice" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-control" v-model="item.description" rows="2" />
          </div>

          <div v-if="stateMove.products.length > 1">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="removeProduct(index)">
              Remove
            </button>
          </div>
        </div>

        <div class="mb-3">
          <button type="button" class="btn btn-outline-primary" @click="addProduct">
            + Add Another Product
          </button>
        </div>

        <button type="submit" class="btn btn-success">Submit Request</button>
      </form>
    </div>
  </div>
</template>
<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import { onBeforeMount } from 'vue'
import productCRUD from '../modules/productCRUD.js'
import moveCRUD from '../modules/moveCRUD.js'
import moveProductCRUD from '../modules/moveProductCRUD.js'

export default {
  name: "newProduct",
  components: {
    navBarInventory,
  },
  setup() {
    const { stateProduct, getAllProductMainWarehouse } = productCRUD()
    const { stateMove, createMove } = moveCRUD()
    const { createMoveProduct } = moveProductCRUD()

    // ✅ Initialize form state
    onBeforeMount(() => {
      stateMove.newRequester = sessionStorage.getItem('username')
      stateMove.products = [
        { productId: '', quantity: 0, unitPrice: 0, description: '' }
      ]
      getAllProductMainWarehouse()
    })

    // ✅ Add new product input row
    const addProduct = () => {
      stateMove.products.push({ productId: '', quantity: 0, unitPrice: 0, description: '' })
    }

    // ✅ Remove a product row
    const removeProduct = (index) => {
      stateMove.products.splice(index, 1)
    }

    // ✅ Handle form submission
    const newMove = async () => {
      const moveHeader = await createMove()
      if (!moveHeader || !moveHeader.id) {
        alert("Failed to create move.")
        return
      }

      const products = stateMove.products.map(p => ({
        productId: p.productId,
        quantity: Number(p.quantity),
        unitPrice: Number(p.unitPrice),
        total: p.quantity * p.unitPrice,
        description: p.description
      }))

      const result = await createMoveProduct(moveHeader.id, products)

      if (result && result.message) {
        alert("Move request submitted successfully!")
        // Optional: reset form
        stateMove.products = [
          { productId: '', quantity: 0, unitPrice: 0, description: '' }
        ]
      } else {
        alert("Failed to submit move products.")
      }
    }

    return {
      stateProduct,
      stateMove,
      getAllProductMainWarehouse,
      addProduct,
      removeProduct,
      newMove
    }
  }
}
</script>
