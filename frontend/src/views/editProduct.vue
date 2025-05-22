<template>
  <div>
    <navBarInventory />

    <div class="container my-5">
      <h2 class="fw-bold mb-4">Detail Produk</h2>
      <div v-if="stateProduct.product?.data" class="card p-4 shadow-sm">
        <p><strong>ID:</strong> {{ stateProduct.product.data.id }}</p>
        <p><strong>Nama:</strong> {{ stateProduct.product.data.name }}</p>
        <p><strong>Stok:</strong> {{ stateProduct.product.data.stock }}</p>
        <p><strong>Deskripsi:</strong> {{ stateProduct.product.data.description }}</p>
        <p>
          <strong>Status:</strong>
          <span :class="stateProduct.product.data.status === 1 ? 'text-success fw-bold' : 'text-danger fw-bold'">
            {{ stateProduct.product.data.status === 1 ? 'Aktif' : 'Nonaktif' }}
          </span>
        </p>

        <div class="d-flex flex-wrap align-items-center gap-3 mt-4">
          <button class="btn btn-success" @click="showModal = true">Restock</button>
          <button class="btn btn-outline-primary" @click="handleUpdateStatus">Update Status</button>
        </div>

        <div class="mt-3" v-if="isConvertible">
          <button class="btn btn-warning" @click="showConvertModal = true">Convert to Biji</button>
        </div>

        <div class="mt-4">
          <label class="form-label">Deskripsi Baru</label>
          <textarea
            v-model="stateProduct.newDescription"
            class="form-control"
            rows="3"
            placeholder="Tulis deskripsi baru di sini..."
          ></textarea>
          <button class="btn btn-warning mt-2" @click="handleUpdateDescription">Update Deskripsi</button>
        </div>
      </div>
    </div>

    <!-- Restock Modal -->
    <div class="modal fade" id="restockModal" tabindex="-1" aria-hidden="true" ref="modalRef" v-if="stateProduct.product?.data">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Restock Produk</h5>
            <button type="button" class="btn-close" @click="hideModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>ID Produk:</strong> {{ stateProduct.product.data.id }}</p>
            <p><strong>Nama Produk:</strong> {{ stateProduct.product.data.name }}</p>
            <p><strong>Gudang:</strong> {{ stateProduct.product.data.warehouseId }}</p>
            <div class="mb-3">
              <label class="form-label">Jumlah Restock</label>
              <input type="number" v-model="restockAmount" class="form-control" placeholder="Masukkan jumlah stok" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="hideModal">Batal</button>
            <button class="btn btn-success" @click="submitRestock">Simpan</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Convert Modal -->
    <div class="modal fade" id="convertModal" tabindex="-1" aria-hidden="true" ref="convertModalRef" v-if="stateProduct.product?.data">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Konversi Satuan</h5>
            <button type="button" class="btn-close" @click="hideConvertModal"></button>
          </div>
          <div class="modal-body">
            <p>
              Berapa <strong>{{ stateProduct.product.data.unit }}</strong> yang ingin dikonversi ke
              <strong>{{ stateProduct.product.data.unitConversion }}</strong>?
            </p>
            <input
              type="number"
              class="form-control mb-3"
              min="1"
              :max="stateProduct.product.data.stock"
              v-model.number="convertAmount"
            />

            <label class="form-label">Harga per {{ stateProduct.product.data.unitConversion }}</label>
            <input
              type="number"
              class="form-control"
              min="1"
              v-model.number="convertPrice"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="hideConvertModal">Batal</button>
            <button class="btn btn-warning" @click="submitConvert">Konversi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBarInventory from "@/components/NavBarInventory.vue";
import productCRUD from "../modules/productCRUD.js";
import { onBeforeMount, ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "editProduct",
  components: { navBarInventory },
  setup() {
    const {
      stateProduct,
      getOneProduct,
      restockProduct,
      updateStatusProduct,
      updateDescription,
      convertUnit,
    } = productCRUD();

    const route = useRoute();
    const restockAmount = ref(0);
    const convertAmount = ref(1);
    const convertPrice = ref(0); // ✅ new
    const showModal = ref(false);
    const showConvertModal = ref(false);
    const modalRef = ref(null);
    const convertModalRef = ref(null);
    const isConvertible = ref(false);

    const refreshProduct = async () => {
      await getOneProduct(route.params.id);
    };

    const submitRestock = async () => {
      await restockProduct(stateProduct.product.data.id, restockAmount.value);
      restockAmount.value = 0;
      await refreshProduct();
      hideModal();
    };

    const handleUpdateDescription = async () => {
      await updateDescription(
        stateProduct.product.data.id,
        stateProduct.newDescription
      );
      stateProduct.newDescription = "";
      await refreshProduct();
    };

    const handleUpdateStatus = async () => {
      await updateStatusProduct(
        stateProduct.product.data.id,
        stateProduct.product.data.status
      );
      await refreshProduct();
    };

    const submitConvert = async () => {
      const max = stateProduct.product.data.stock;
      if (convertAmount.value < 1 || convertAmount.value > max) {
        alert(`Jumlah harus antara 1 sampai ${max}`);
        return;
      }

      try {
        const res = await convertUnit(
          stateProduct.product.data.id,
          convertAmount.value,
          convertPrice.value // ✅ send price
        );
        if (res && res.message) {
          alert("Konversi berhasil!");
          await refreshProduct();
          hideConvertModal();
        } else {
          alert(res.error || "Gagal melakukan konversi.");
        }
      } catch (err) {
        console.error("Convert Error:", err);
        alert("Terjadi kesalahan saat konversi.");
      }
    };

    const hideModal = () => {
      const modal = window.bootstrap.Modal.getInstance(modalRef.value);
      modal?.hide();
      showModal.value = false;
    };

    const hideConvertModal = () => {
      const modal = window.bootstrap.Modal.getInstance(convertModalRef.value);
      modal?.hide();
      showConvertModal.value = false;
    };

    watch(showModal, (val) => {
      if (val) {
        nextTick(() => {
          const modal = new window.bootstrap.Modal(modalRef.value);
          modal.show();
        });
      }
    });

    watch(showConvertModal, async (val) => {
      if (val) {
        const p = stateProduct.product?.data;
        const res = await fetch(`https://bmp-inv-be.zenbytes.id/productCategories/`);
        const allCategories = await res.json();
        const cat = allCategories.find(c => c.id === p.categoryId);
        if (cat?.conversionRate) {
          convertPrice.value = Math.floor(p.price / parseInt(cat.conversionRate)); // ✅ suggested price
        }

        nextTick(() => {
          const modal = new window.bootstrap.Modal(convertModalRef.value);
          modal.show();
        });
      }
    });

    const checkConvertibility = async () => {
      const p = stateProduct.product?.data;
      const role = parseInt(sessionStorage.getItem("role"));
      if (!p || !(role === 1 || role === 2)) {
        console.log("masuk cek product + role")
        isConvertible.value = false;
        return;
      }
      try {
        const res = await fetch(`https://bmp-inv-be.zenbytes.id/productCategories/`);
        const allCategories = await res.json();
        const cat = allCategories.find(c => c.id === p.categoryId);
        if (
          cat &&
          !["", "-", null, undefined].includes(cat.unitConversion?.trim()) &&
          cat.conversionRate &&
          p.stock >= 1
        ) {
          isConvertible.value = true;
        } else {
          isConvertible.value = false;
        }
      } catch (err) {
        console.error("Error checking convertibility:", err);
        isConvertible.value = false;
      }

    };

    onBeforeMount(async () => {
      await refreshProduct();
      await checkConvertibility();
    });

    return {
      stateProduct,
      restockAmount,
      convertAmount,
      convertPrice,
      showModal,
      showConvertModal,
      modalRef,
      convertModalRef,
      hideModal,
      hideConvertModal,
      checkConvertibility,
      submitRestock,
      submitConvert,
      handleUpdateDescription,
      handleUpdateStatus,
      isConvertible,
    };
  },
};
</script>

<style scoped>
.btn-warning {
  color: #fff;
}
</style>
