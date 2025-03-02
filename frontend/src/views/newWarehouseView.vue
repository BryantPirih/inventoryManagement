<template lang="">
    <div>
        <navBarInventory/>

        <body class="container-fluid">

            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="username" class="form-label">Warehouse Name</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="state.newWRHS"><br>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Full Address</label>
                        <input type="text" id="warehouse" name="address" class="form-control" required 
                        v-model="state.newAddress">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Province</label>
                        <input type="text" id="warehouse" name="province" class="form-control" required 
                        v-model="state.newProvince">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">City/Kabupaten</label>
                        <input type="text" id="warehouse" name="city" class="form-control" required 
                        v-model="state.newCity">
                    </div>
                    
                    <button @click="newWarehouse()" type="submit" class="btn btn-success">Create</button>
                </form>
            </div>

        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import warehouseCRUD from '../modules/warehouseCRUD.js'
//import {onMounted} from 'vue'

export default {
    name:"newWarehouse",
    components:{
        navBarInventory,
    },
    setup(){
        const {state, newWarehouse} = warehouseCRUD()

        return {state, newWarehouse}
    },
    data(){
        return {
        search: "",
        options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
            { label: "Date", value: "date" },
            { label: "Elderberry", value: "elderberry" }
        ],
        filteredOptions: []
        };
    },
    methods: {
        filterOptions() {
        const searchTerm = this.search.toLowerCase();
        this.filteredOptions = this.options.filter(option => 
            option.label.toLowerCase().includes(searchTerm)
        );
        },
        selectOption(option) {
        this.search = option.label;
        this.filteredOptions = [];
        }
    },
    mounted() {
        this.filteredOptions = this.options;
    }
    
}
</script>
<style lang="">
    
</style>