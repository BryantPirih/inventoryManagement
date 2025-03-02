import {reactive} from 'vue'

const getWishlist =() =>{
    const stateWishlist = reactive({
        newUsername: '',
        newProductID: '',
        newProductName: '',
        wishlist : {}
    })

    const getAllWishlist = async () =>{
        try {
            await fetch("http://localhost:3000/wishlist/")
            .then(res=> res.json())
            .then(data=> {
                stateWishlist.cart = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneWishlist = async (username) =>{
        try {
            await fetch("http://localhost:3000/wishlist/get/"+username)
            .then(res=> res.json())
            .then(data=> {
                stateWishlist.wishlist = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newWishlist = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                username: stateWishlist.newUsername,
                item: [{
                    productID : stateWishlist.newProductID,
                    productName : stateWishlist.newProductName
                }],
            })
        }
        fetch("http://localhost:3000/wishlist/new",
        request
        )
    }

    return {
        stateWishlist,
        getAllWishlist,
        getOneWishlist,
        newWishlist
    }
}

export default getWishlist