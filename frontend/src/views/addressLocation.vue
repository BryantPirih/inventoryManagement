<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>alamat pengiriman</h2> 
    <router-link to="/newAddressLocation" class="nav-link">
      <button class="btnNewWorker btn btn-success">tambah alamat</button>
    </router-link> <br><br>
    
    <div class="col mb-3" v-if="stateAddress.address.data != null">
        <div class="row-md-4 mt-d" v-for="item in stateAddress.address" :key="item.id">
            <cardAddress :item="item"/>
        </div>
    </div>

    <div v-else>
      blom ada data alamat
    </div>
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardAddress from "@/components/cardAddress.vue";
import addressCRUD from "../modules/addressCRUD.js";
import  {onMounted}  from "vue";
export default {
  name: "addressLocation",
  components: {
    navBarUser,
    cardAddress
  },
  setup() {

    const { stateAddress, getOneAddress } = addressCRUD();

    onMounted(() => {
      stateAddress.newUsername = sessionStorage.getItem("username");
      getOneAddress(stateAddress.newUsername);
    });
    return { stateAddress, getOneAddress };
  }
};
</script>
<style lang="">
</style>