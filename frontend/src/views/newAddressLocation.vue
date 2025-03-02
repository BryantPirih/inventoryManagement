<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>isi alamat baru</h2> 
    <body class="container-fluid">

<div class="containerNew">
    <form>
        <div class="mb-3">
            <label for="username" class="form-label">Alamat Lengkap</label>
            <input type="text" id="warehouse" name="fullAddress" class="form-control" required
            v-model="stateAddress.fullAddress">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">provinsi</label>
            <input type="text" id="warehouse" name="province" class="form-control" required 
            v-model="stateAddress.province">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Kota</label>
            <input type="text" id="warehouse" name="city" class="form-control" required 
            v-model="stateAddress.city">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Kecamatan</label>
            <input type="text" id="warehouse" name="district" class="form-control" required 
            v-model="stateAddress.district">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Kelurahan</label>
            <input type="text" id="warehouse" name="subDistrict" class="form-control" required 
            v-model="stateAddress.subDistrict">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Kode Pos</label>
            <input type="number" id="warehouse" name="postalCode" class="form-control" required 
            v-model="stateAddress.postalCode">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">nama penerima</label>
            <input type="text" id="warehouse" name="recipientName" class="form-control" required 
            v-model="stateAddress.recipientName">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">email penerima</label>
            <input type="text" id="warehouse" name="recipientEmail" class="form-control" required 
            v-model="stateAddress.recipientEmail">
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">nomor telepon penerima</label>
            <input type="number" id="warehouse" name="recipientPhone" class="form-control" required 
            v-model="stateAddress.recipientPhone">
        </div>

        <button @click="newAddress()" type="submit" class="btn btn-success">buat alamat</button>
    </form>
</div>

</body>
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import addressCRUD from '../modules/addressCRUD'
import  {onMounted}  from "vue";
export default {
  name: "newAddressLocation",
  components: {
    navBarUser,
  },
  setup() {
    const {stateAddress, newAddress} = addressCRUD()

    onMounted(() => {
        stateAddress.newUsername = sessionStorage.getItem("username");
    });
    return {stateAddress, newAddress}
  },
};
</script>
<style lang="">
</style>