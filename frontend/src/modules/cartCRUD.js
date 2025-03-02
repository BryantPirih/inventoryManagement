import {reactive} from 'vue'

const getCart =() =>{
    const stateCart = reactive({
        newUsername: '',
        newProductID: '',
        newProductName: '',
        newQty: 1,
        cart : {}
    })

    const getAllCart = async () =>{
        try {
            await fetch("http://localhost:3000/cart/")
            .then(res=> res.json())
            .then(data=> {
                stateCart.cart = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneCart = async (username) =>{
        try {
            await fetch("http://localhost:3000/cart/get/"+username)
            .then(res=> res.json())
            .then(data=> {
                stateCart.cart = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newCart = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                username: stateCart.newUsername,
                item: [{
                    productID : stateCart.newProductID,
                    productName : stateCart.newProductName,
                    qty : stateCart.newQty
                }],
            })
        }
        fetch("http://localhost:3000/cart/new",
        request
        )
    }

    return {
        stateCart,
        getAllCart,
        getOneCart,
        newCart
    }
}

export default getCart