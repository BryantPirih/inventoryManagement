<template>
  <div>
    <navBarUser />
    <div class="container my-5">
      <h3 class="fw-bold mb-4">Keranjang</h3>

      <div class="row">
        <div class="col-lg-8">
          <div class="card p-3 mb-3 shadow-sm rounded-4 border-0">
            <div v-if="stateCart.cart.data?.item?.length">
              <div
                class="d-flex align-items-center py-3 border-bottom"
                v-for="(item, index) in stateCart.cart.data.item"
                :key="index"
              >
                <img
                  :src="'http://localhost:3000' + (getProductImage(item.productID) || '/uploads/products/default.png')"
                  class="rounded"
                  width="80"
                  height="80"
                  style="object-fit: cover;"
                />


                <div class="ms-3 flex-grow-1">
                  <p class="mb-1 fw-semibold">{{ item.productName }}</p>
                  <small class="text-muted">Stok tersedia</small>
                </div>

                <div class="text-end me-3">
                  <p class="mb-1 fw-bold text-success">
                    Rp {{ (getProductPrice(item.productID) * item.qty).toLocaleString('id-ID') }}
                  </p>

                  <div class="d-flex align-items-center gap-2 justify-content-end">
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="updateQty(index, item.qty - 1)"
                      :disabled="item.qty === 1"
                    >
                      -
                    </button>

                    <!-- Quantity Input -->
                    <input
                      type="text"
                      class="form-control text-center"
                      style="width: 50px"
                      :value="item.qty"
                      readonly
                    />

                    <!-- Increment Button -->
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="updateQty(index, item.qty + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button class="btn btn-outline-danger btn-sm ms-2" @click="deleteItem(item._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <div v-else class="text-center py-4 text-muted">
              Keranjang Anda kosong.
            </div>
          </div>
        </div>

        <!-- Right: Summary -->
        <div class="col-lg-4">
          <div class="card p-4 shadow-sm rounded-4 border-0">
            <h5 class="fw-bold mb-3">Ringkasan Belanja</h5>
            <div class="d-flex justify-content-between border-bottom pb-2 mb-3">
              <span>Total</span>
              <strong>Rp {{ getTotalPrice().toLocaleString('id-ID') }}</strong>
            </div>
            <router-link to="/checkoutCart">
              <button class="btn btn-success w-100 rounded-pill fw-semibold">
                Beli ({{ stateCart.cart.data?.item.length || 0 }})
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import navBarUser from '@/components/navBarUser.vue'
import cartCRUD from '../modules/cartCRUD.js'
import productCRUD from '../modules/productCRUD.js'

const { stateCart, getOneCart, deleteItem, updateItemQty } = cartCRUD()
const { stateProduct, getAllProductMainWarehouse } = productCRUD()

const products = reactive([])

const updateQty = async (index, newQty) => {
  if (newQty < 0) return

  const item = stateCart.cart.data.item[index]

  // Update quantity in backend
  await updateItemQty(stateCart.cart.data._id, item._id, newQty)

  // Optional: Optimistic update
  item.qty = newQty
}


const getProductPrice = (productId) => {
  if (!productId) return 0
  const product = products.find((p) => p.id === productId)
  return product?.price || 0
}

const getProductImage = (productId) => {
  if (!productId) return null;
  const product = products.find((p) => p.id === productId);
  return product?.imageUrl || null;
};


const getTotalPrice = () => {
  if (!stateCart.cart.data?.item || !products.length) return 0

  return stateCart.cart.data.item.reduce((total, item) => {
    const price = getProductPrice(item.productID)
    return total + price * item.qty
  }, 0)
}

onMounted(async () => {
  stateCart.newUsername = sessionStorage.getItem('username')
  await getOneCart(stateCart.newUsername)
  await getAllProductMainWarehouse()
  products.push(...stateProduct.product)
})

</script>