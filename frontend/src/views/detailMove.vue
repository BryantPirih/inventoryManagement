<template>
  <div>
    <navBarInventory />

    <div class="container py-5">
      <!-- 🔄 Loading State -->
      <div v-if="!stateMove.move?.data || !stateMoveProduct.moveProducts?.data?.products" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Memuat data...</p>
      </div>

      <!-- ✅ Detail Content -->
      <div v-else class="mx-auto" style="max-width: 700px">
        <div class="mb-4">
          <h2 class="fw-bold mb-2">Detail Pindah Stok</h2>
          <h4 class="text-muted">ID: {{ stateMove.move.data.id }}</h4>
          <hr />
        </div>

        <div class="mb-3">
          <p><strong>Requester:</strong> {{ stateMove.move.data.requester }}</p>
          <p><strong>Approver:</strong> {{ stateMove.move.data.approver }}</p>
          <p><strong>Dari Gudang:</strong> {{ stateMove.move.data.from }}</p>
          <p><strong>Ke Gudang:</strong> {{ stateMove.move.data.to }}</p>

          <p class="mb-2">
            <strong>Status:</strong>
            <span v-if="stateMove.move.data.status === 0" class="badge bg-warning text-dark">Menunggu approval</span>
            <span v-if="stateMove.move.data.status === 1" class="badge bg-info text-dark">Sedang diproses</span>
            <span v-if="stateMove.move.data.status === 2" class="badge bg-primary">Sedang dikirim</span>
            <span v-if="stateMove.move.data.status === 3" class="badge bg-success">Telah diterima</span>
            <span v-if="stateMove.move.data.status === 4" class="badge bg-secondary">Sudah difinalisasi</span>
          </p>
        </div>

        <!-- 🛒 Products -->
        <div class="mb-4">
          <h5 class="fw-bold mb-2">Produk yang Dipindahkan:</h5>
          <ul class="list-group">
            <li
              v-for="(p, i) in stateMoveProduct.moveProducts.data.products"
              :key="i"
              class="list-group-item d-flex justify-content-between align-items-start"
            >
              <div class="ms-2 me-auto">
                <div class="fw-semibold">{{ getProductName(p.productId) }}</div>
                {{ p.description }}
              </div>
              <span class="badge bg-secondary rounded-pill">Qty: {{ p.quantity }}</span>
              <span class="ms-3">Rp{{ p.unitPrice.toLocaleString() }}</span>
              <span class="ms-3 fw-bold">Total: Rp{{ p.total.toLocaleString() }}</span>
            </li>
          </ul>
        </div>

        <!-- 🔘 Action Buttons -->
        <div class="d-flex gap-3" v-if="stateMove.move.data.status < 4">
          <button class="btn btn-outline-success" @click="updateMove(stateMove.move.data.id, stateMove.move.data.status, approver)">
            Update Status
          </button>

          <button
            class="btn btn-primary"
            v-if="stateMove.move.data.status === 3"
            :disabled="finalized"
            @click="finalizeTransfer(stateMove.move.data.id)"
          >
            {{ finalized ? 'Sudah Difinalisasi' : 'Finalisasi Perpindahan Stok' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from '@/components/NavBarInventory.vue'
import moveCRUD from '../modules/moveCRUD.js'
import moveProductCRUD from '../modules/moveProductCRUD.js'
import productCRUD from '../modules/productCRUD.js'
import { onBeforeMount, watch, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'detailMove',
  components: {
    navBarInventory,
  },
  setup() {
    const { stateMove, getOneMove, updateMove } = moveCRUD()
    const { stateMoveProduct, getMoveProduct, finalizeMove } = moveProductCRUD()
    const { stateProduct, getAllProductMainWarehouse } = productCRUD()
    const route = useRoute()
    const approver = sessionStorage.getItem('username')
    const finalized = ref(false)

    const refreshMoveData = async () => {
      await getOneMove(route.params.id)
      await getMoveProduct(route.params.id) // ← this is the key fix
    }


    onBeforeMount(() => {
      refreshMoveData()
      getAllProductMainWarehouse()
    })

    watch(
      () => stateMove.move,
      (newVal) => {
        if (newVal && newVal.data) {
          getMoveProduct(newVal.data.id)
        }
      }
    )

    const finalizeTransfer = async (moveId) => {
      try {
        const result = await finalizeMove(moveId)
        if (result && result.message) {
          alert('Perpindahan stok berhasil difinalisasi!')
          finalized.value = true
          await refreshMoveData()
          getMoveProduct(moveId) // ensure latest data shown after finalizing
        } else {
          alert('Gagal finalisasi perpindahan.')
        }
      } catch (err) {
        console.error('Finalize error:', err)
      }
    }

    const getProductName = (productId) => {
      const products = stateProduct.product
      if (!Array.isArray(products)) return productId // 🛡 prevent .find() error
      const product = products.find(p => p.id === productId)
      return product ? product.name : productId
    }


    return {
      stateMove,
      stateMoveProduct,
      stateProduct,
      getAllProductMainWarehouse,
      getOneMove,
      getMoveProduct,
      updateMove,
      finalizeTransfer,
      getProductName,
      approver,
      finalized
    }
  }
}
</script>

<style></style>
