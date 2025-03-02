<template lang="">
    <div>
        <navBarInventory/>
        <body>
            Stock Opname
            <button @click="saveTable">Save</button>
            <table class="table">
                <thead>
                    <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Old Stock</th>
                    <th>New Stock</th>
                    <th>Reason</th>
                    <th>Last Update Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in stateProduct.product" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{item.name}} </td>
                    <td>{{item.stock}} </td>
                    <td>
                        <input
                        type="number"
                        v-model="item.newStock"
                        placeholder="Enter stock"
                        />
                    </td>
                    <td>
                        <input
                        type="text"
                        v-model="item.newReason"
                        placeholder="Enter reason"
                        />
                    </td>
                    <td>{{item.lastUpdate}}</td>
                    </tr>
                </tbody>
            </table>    
        </body>
    </div>
</template>
<script>

import navBarInventory from '@/components/NavBarInventory.vue'
import productCRUD from '../modules/productCRUD.js'
import { onMounted } from 'vue'
export default {
    name:"stockOpname",
    components:{
        navBarInventory
    },
    methods: {
        async saveTable() {
            try {
                const response = await fetch("http://localhost:3000/product/stockOpname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                    body: JSON.stringify({
                        data :this.stateProduct.product,
                        user : sessionStorage.getItem('username')
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to save data");
                }
                alert("Table data saved successfully!");
            } catch (error) {
                console.error("Error saving table data:", error);
                alert("An error occurred while saving data.");
            }
        },
    },
    setup(){
        const {stateProduct, getAllProduct} = productCRUD()

        onMounted(()=>{
            getAllProduct()
        })
        return {stateProduct, getAllProduct}
    },
}
</script>
<style lang="">
    
</style>