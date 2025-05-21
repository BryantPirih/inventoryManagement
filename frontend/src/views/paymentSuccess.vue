<template>
  <div class="container text-center my-5">
    <h2>Payment Successful!</h2>
    <p>Thank you for your purchase.</p>
    <router-link to="/history">
      <button class="btn btn-primary">Check Order Status</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "paymentSuccessView"
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
h2 {
  font-size: 2rem;
  font-weight: bold;
}
p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
