<template lang="">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Inventory</a>

            <!-- toggle button -->
            <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>

            <!-- sidebar -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <router-link to="/overviewWorker" class="nav-link">Overview</router-link>
                    </li>
                    <li class="nav-item">
                    <router-link to="/productsWorker" class="nav-link">Products</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Operation
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link to="/stockOpname" class="nav-link dropdown-item">Stock Opname</router-link></li>
                            <li><router-link to="/detailedProduct" class="nav-link dropdown-item">Edit/Restock Product</router-link></li>
                            <li><router-link to="/move" class="nav-link dropdown-item">Pindah Barang</router-link></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Reporting
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Stock</a></li>
                            <li><a class="dropdown-item" href="#">Move History</a></li>
                            <li><a class="dropdown-item" href="#">Performance</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Configuration
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link to="/warehouse" class="nav-link">Warehouse</router-link></li>
                            <li><router-link to="/productCategoriesWorker" class="nav-link">Product Categories</router-link></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><router-link to="/discountOverview" class="nav-link">Discount</router-link></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><router-link to="/worker" class="nav-link">Worker</router-link></li>
                        </ul>
                    </li>
                </ul>
                <button @click="logout()" class="btn btn-outline-danger" type="submit">Logout</button>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
  name: "navBarInventory",
  methods:{
        async logout(){
            sessionStorage.clear();
            this.$router.push({name:'login'})
        }
    }
};
</script>
<style scoped lang="">
    
</style>