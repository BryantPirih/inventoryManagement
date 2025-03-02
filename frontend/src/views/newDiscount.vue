<template lang="">
    <div>
        <navBarInventory/>

        <body class="container-fluid">

            <div class="containerNew">
                <form>
                    <div class="mb-3">
                        <label for="username" class="form-label">Discount Name</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newNameDiscount" >
                        
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Discount Code</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newDiscountCode">
                        
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Payment Method</label>
                        <select name="role" id="" class="form-select" v-model="stateDiscount.newPaymentMethod">
                            <option value="1">Cash on Delivery (COD)</option>
                            <option value="2">Payment Gateway</option>
                            <option value="3">Semua</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Discount type</label>
                        <select name="role" id="" class="form-select" v-model="stateDiscount.newDiscountType">
                            <option value="1">Jumlah tetap</option>
                            <option value="2">Percentage</option>
                            <option value="3">Semua</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Fixed Amount</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newFixedAmountDiscount">
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Percentage</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newPercentageDiscount">
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Discount start date</label>
                        <VueDatePicker v-model="stateDiscount.newDiscountStart"></VueDatePicker>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Discount end date</label>
                        <VueDatePicker v-model="stateDiscount.newDiscountEnd"></VueDatePicker>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Minumum Transaction</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newMinimumTransaction">
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Usage Limit</label>
                        <input type="text" id="warehouse" name="warehouse" class="form-control" required 
                        v-model="stateDiscount.newUsageLimit">
                    </div>

                    <button @click="newDiscount()" type="submit" class="btn btn-success">Create</button>
                </form>
            </div>

        </body>
    </div>
</template>
<script>


import navBarInventory from '@/components/NavBarInventory.vue'
import discountCRUD from '../modules/discountCRUD'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
//import {onMounted} from 'vue'

export default {
    name:"newDiscount",
    components:{
        navBarInventory,
        VueDatePicker
    },
    setup(){
        const {stateDiscount, newDiscount} = discountCRUD()

        return {stateDiscount, newDiscount}
    }
}
</script>
<style lang="">
    
</style>