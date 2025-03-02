import {reactive} from 'vue'

const getDiscount =() =>{
    const stateDiscount = reactive({
        newNameDiscount: '',
        newDiscountCode: '',
        newPaymentMethod: '',
        newDiscountType: '',
        newFixedAmountDiscount: '',
        newPercentageDiscount: '',
        newDiscountStart : '',
        newDiscountEnd : '',
        newMinimumTransaction : '',
        newUsageLimit : '',
        discount : {}
    })

    const getAllDiscount = async () =>{
        try {
            await fetch("http://localhost:3000/discount/")
            .then(res=> res.json())
            .then(data=> {
                stateDiscount.discount = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneDiscount = async (discountCode) =>{
        try {
            await fetch("http://localhost:3000/discount/get/"+discountCode)
            .then(res=> res.json())
            .then(data=> {
                stateDiscount.discount = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newDiscount = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                name: stateDiscount.newNameDiscount,
                discountCode: stateDiscount.newDiscountCode,
                paymentMethod: stateDiscount.newPaymentMethod,
                discountType: stateDiscount.newDiscountType,
                fixedAmountDiscount: stateDiscount.newFixedAmountDiscount,
                percentageDiscount: stateDiscount.newPercentageDiscount,
                discountStart: stateDiscount.newDiscountStart,
                discountEnd: stateDiscount.newDiscountEnd,
                minimumTransaction: stateDiscount.newMinimumTransaction,
                usageLimit: stateDiscount.newUsageLimit,
            })
        }
        fetch("http://localhost:3000/discount/new",
        request
        )
    }

    return {
        stateDiscount,
        getAllDiscount,
        newDiscount,
        getOneDiscount
    }
}

export default getDiscount