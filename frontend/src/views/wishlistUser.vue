<template lang="">
    <div>
        <navBarUser/>
    </div>
    <h2>daftar wishlist</h2>
    <div class="col mb-3" v-if="stateWishlist.wishlist.data != null">
        <div class="row-md-4 mt-d" v-for="item in stateWishlist.wishlist" :key="item.id">
            <cardWishlist :item="item"/>
        </div>
    </div>

    <div v-else>
      belom ada wishlist
    </div>
</template>
<script>
import navBarUser from "@/components/navBarUser.vue";
import cardWishlist from "@/components/cardWishlist.vue";
import wishlistCRUD from "../modules/wishlistCRUD.js";
import  {onMounted}  from "vue";
export default {
  name: "wishlistUser",
  components: {
    navBarUser,
    cardWishlist
  },
  setup() {

    const { stateWishlist, getOneWishlist } = wishlistCRUD();
    onMounted(() => {
        stateWishlist.newUsername = sessionStorage.getItem("username");
        getOneWishlist(stateWishlist.newUsername);
    });
    return { stateWishlist, getOneWishlist };
  }
};
</script>
<style lang="">
</style>