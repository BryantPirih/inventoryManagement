<template lang="">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <router-link to="/home" class="navbar-brand">Neo Grosir</router-link>

            <!-- toggle button -->
            <button class="navbar-toggler shadow-none" type="button" data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>

            <!-- sidebar -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">

                
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>

                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <router-link to="/history" class="nav-link"><i class="bi bi-card-list" style="font-size: 25px;"></i></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/cart" class="nav-link"><i class="bi bi-cart" style="font-size: 25px;"></i></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/wishlist" class="nav-link"><i class="bi bi-heart" style="font-size: 25px;"></i></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="" class="nav-link"><i class="bi bi-bell" style="font-size: 25px;"></i></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/addressLocation" class="nav-link"><i class="bi bi-geo-alt" style="font-size: 25px;"></i></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="" class="nav-link"><i class="bi bi-gear" style="font-size: 25px;"></i></router-link>
                    </li>
                </ul>

                <button @click="logout()" class="btn btn-outline-danger" type="submit">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script>

export default {
  name: "navBarUser",
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