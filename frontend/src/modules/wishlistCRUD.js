import { reactive } from 'vue'

const getWishlist = () => {
  const stateWishlist = reactive({
    newUsername: '',
    newProductID: '',
    newProductName: '',
    newQuantity: 1, // Quantity default to 1
    wishlist: {},
    allWishlists: []
  })

  // Fetch all wishlists (admin or user)
  const getAllWishlist = async () => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/wishlist/");
      const data = await res.json();
      stateWishlist.allWishlists = data; // Updated to store all wishlists
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch one user's wishlist
  const getOneWishlist = async (username) => {
    try {
      const res = await fetch(`https://bmp-inv-be.zenbytes.id/wishlist/get/${username}`);
      const data = await res.json();
      stateWishlist.wishlist = data.data; // Updated to store fetched wishlist
    } catch (error) {
      console.log(error);
    }
  }

  // Create new wishlist or add to existing wishlist
  const newWishlist = async () => {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Authtoken can go here if needed
      },
      body: JSON.stringify({
        username: stateWishlist.newUsername,
        items: [{
          productID: stateWishlist.newProductID,
          productName: stateWishlist.newProductName,
          quantity: stateWishlist.newQuantity,  // Now including quantity
        }]
      })
    }
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/wishlist/new", request);
      const data = await res.json();
      console.log(data.message); // Display message upon successful creation
    } catch (error) {
      console.log(error);
    }
  }

  // Update existing wishlist (change quantity or other details)
  const updateWishlist = async (id, updatedData) => {
    try {
      const request = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      };
      await fetch(`https://bmp-inv-be.zenbytes.id/wishlist/update/${id}`, request);
    } catch (error) {
      console.log(error);
    }
  }

    // Delete wishlist for a specific user
    const deleteWishlist = async (username) => {
      try {
        await fetch(`https://bmp-inv-be.zenbytes.id/wishlist/delete/${username}`, {
          method: "DELETE"
        });
      } catch (error) {
        console.log(error);
      }
    };


  return {
    stateWishlist,
    getAllWishlist,
    getOneWishlist,
    newWishlist,
    deleteWishlist,
    updateWishlist
  }
}

export default getWishlist
