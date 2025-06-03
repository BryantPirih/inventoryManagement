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
            await fetch("https://bmp-inv-be.zenbytes.id/discount/")
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
            await fetch("https://bmp-inv-be.zenbytes.id/discount/get/"+discountCode)
            .then(res=> res.json())
            .then(data=> {
                stateDiscount.discount = data
            });
        } catch (error) {
            console.log(error)
        }
    }

const newDiscount = async () => {
  try {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // authtoken bisa disini kalau perlu
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
    };

    const res = await fetch("https://bmp-inv-be.zenbytes.id/discount/new", request);
    const data = await res.json();

    if (res.ok) {
      return true;
    } else {
      console.error("Failed response:", data);
      return false;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
};


    const deleteDiscount = async (id) => {
        try {
            await fetch(`https://bmp-inv-be.zenbytes.id/discount/delete/${id}`, {
            method: "DELETE"
            });
            await getAllDiscount(); 
        } catch (error) {
            console.error("Error deleting discount:", error);
        }
    };


    return {
        stateDiscount,
        getAllDiscount,
        newDiscount,
        getOneDiscount,
        deleteDiscount
    }
}

export default getDiscount