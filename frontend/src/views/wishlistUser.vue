<template>
  <div>
    <navBarUser />
    <div class="container my-5">
      <h2 class="fw-bold mb-4">Daftar Wishlist</h2>
      
      <div class="row gx-4">
        <!-- Left: Wishlist Items -->
        <div class="col-md-8">
          <!-- Only render list if items exist -->
          <template v-if="stateWishlist.wishlist && stateWishlist.wishlist.items?.length > 0">
            <div
              v-for="item in stateWishlist.wishlist.items"
              :key="item.productID"
              class="border rounded p-3 mb-3"
            >
              <div class="d-flex justify-content-between align-items-start">
                <!-- Product Image -->
                <div class="d-flex">
                  <img
                    :src="'https://bmp-inv-be.zenbytes.id' + getImage(item.productID)"
                    alt="Product"
                    width="80"
                    height="80"
                    class="rounded me-3"
                    style="object-fit: cover; aspect-ratio: 1/1; background-color: #f8f9fa"
                  />

                  <!-- Product Info -->
                  <div>
                    <h5 class="mb-1">{{ item.productName }}</h5>
                    <div class="small text-muted">Qty: {{ item.quantity }}</div>
                    <div class="small">
                      Status:
                      <span
                        :class="{
                          'text-success': item.status === 'in-stock',
                          'text-danger': item.status === 'out-of-stock'
                        }"
                      >
                        {{ item.status === 'in-stock' ? 'Available' : 'Out of Stock' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Delete Button -->
                <button class="btn btn-outline-danger btn-sm" @click="deleteItemFromWishlist(item.productID)">
                  <i class="bi bi-trash"></i> Hapus
                </button>
              </div>
            </div>
          </template>

          <!-- Empty state -->
          <div v-else class="text-center text-muted py-5">
            <i class="bi bi-heart fs-1 mb-3"></i>
            <p>Belum ada wishlist</p>
          </div>
        </div>

        <!-- Right: Ringkasan Wishlist -->
        <div class="col-md-4">
          <div class="border rounded p-3">
            <h5 class="fw-semibold mb-3">Ringkasan Wishlist</h5>
            <p class="mb-2">
              Total Items: 
              <strong>{{ stateWishlist.wishlist?.items?.length || 0 }}</strong>
            </p>
            <button 
              class="btn btn-success w-100"
              :disabled="!(stateWishlist.wishlist && stateWishlist.wishlist.items?.length > 0)"
              @click="checkoutWishlist"
            >
              Beli Semua ({{ stateWishlist.wishlist?.items?.length || 0 }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarUser from "@/components/navBarUser.vue";
import wishlistCRUD from "../modules/wishlistCRUD.js";
import productCRUD from "../modules/productCRUD.js";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2';

export default {
  name: "wishlistUser",
  components: { navBarUser },
  setup() {
    const { stateWishlist, getOneWishlist, deleteWishlistItem } = wishlistCRUD();
    const { stateProduct, getAllProductMainWarehouse } = productCRUD();
    const router = useRouter();

    const checkoutWishlist = () => {
      router.push("/checkoutWishlist");
    };

    const deleteItemFromWishlist = async (productID) => {
      const result = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Item ini akan dihapus dari wishlist Anda.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const username = stateWishlist.newUsername || sessionStorage.getItem("username");
        await deleteWishlistItem(username, productID);
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Item berhasil dihapus dari wishlist.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    };


    const getImage = (id) => {
      const p = stateProduct.product.find((p) => p.id === id);
      return p?.imageUrl || "/uploads/products/default.png";
    };

    onMounted(async () => {
      const username = sessionStorage.getItem("username");
      await getAllProductMainWarehouse();
      stateWishlist.newUsername = username;
      getOneWishlist(username);
    });

    return {
      stateWishlist,
      checkoutWishlist,
      stateProduct,
      getAllProductMainWarehouse,
      getImage,
      deleteItemFromWishlist,
    };
  },
};
</script>
