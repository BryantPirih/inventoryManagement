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
            await fetch("https://bmp-inv-be.zenbytes.id/cart/")
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
            await fetch("https://bmp-inv-be.zenbytes.id/cart/get/"+username)
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
        fetch("https://bmp-inv-be.zenbytes.id/cart/new",
        request
        )
    }

    const deleteCart = async (username) => {
        try {
            const response = await fetch(`https://bmp-inv-be.zenbytes.id/cart/delete/${username}`, {
                method: "DELETE"
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    const updateItemQty = async (cartId, itemId, newQty) => {
        try {
            const request = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ qty: newQty })
            }

            const res = await fetch(`https://bmp-inv-be.zenbytes.id/cart/update/${cartId}/${itemId}`, request)
            const data = await res.json()

            // Optionally re-fetch updated cart
            await getOneCart(stateCart.newUsername)

            return data
        } catch (error) {
            console.log(error)
        }
        }


    return {
        stateCart,
        getAllCart,
        getOneCart,
        newCart,
        deleteCart,
        updateItemQty
    }
}

export default getCart