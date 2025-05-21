<template>
  <div class="card shadow-sm h-100">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ item.productName }}</h5>
      <p class="card-text text-muted">{{ item.description }}</p>
      <div class="mt-auto d-flex justify-content-between">
        <button class="btn btn-primary btn-sm" @click="buyNow(item)">Buy Now</button>
        <button class="btn btn-outline-secondary btn-sm" @click="addToCart(item)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    buyNow(item) {
      // Example: store to sessionStorage and redirect
      sessionStorage.setItem('buyNowItem', JSON.stringify({ id: item.id, qty: 1 }));
      this.$router.push('/checkout');
    },
    addToCart(item) {
      // Handle cart addition (sessionStorage, emit, or Vuex)
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      cart.push({ id: item.id, qty: 1 });
      sessionStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart!');
    }
  }
};
</script>