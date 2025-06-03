import { reactive } from 'vue'

const getAddress = () => {
  const stateAddress = reactive({
    newUsername: '',
    fullAddress: '',
    province: '',
    city: '',
    district: '',
    subDistrict: '',
    postalCode: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    address: {}
  })

  // Fetch all addresses for a user
  const getAllAddress = async (username) => {
    try {
      const res = await fetch(`https://bmp-inv-be.zenbytes.id/address/all/${username}`)
      const data = await res.json()
      stateAddress.address = data.data // Update state with all addresses
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch only the default address for a user
  const getOneAddress = async (username) => {
    try {
      const res = await fetch(`https://bmp-inv-be.zenbytes.id/address/get/${username}`)
      const data = await res.json()
      stateAddress.address = data.data // Update state with the default address
    } catch (error) {
      console.log(error)
    }
  }

  // Create a new address
  const newAddress = async () => {
    try {
      await fetch("https://bmp-inv-be.zenbytes.id/address/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: stateAddress.newUsername,
          fullAddress: stateAddress.fullAddress,
          provinceId: stateAddress.province,
          cityId: stateAddress.city,
          district: stateAddress.district,
          subDistrict: stateAddress.subDistrict,
          postalCode: stateAddress.postalCode,
          recipientName: stateAddress.recipientName,
          recipientEmail: stateAddress.recipientEmail,
          recipientPhone: stateAddress.recipientPhone,
          isDefault: 1 
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Update the default address
  const updateAddress = async (id, updatedData) => {
    try {
      await fetch(`https://bmp-inv-be.zenbytes.id/address/updateDefault/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const editAddress = async (id, updatedData) => {
  try {
    await fetch(`https://bmp-inv-be.zenbytes.id/address/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteAddress = async (id) => {
  try {
    await fetch(`https://bmp-inv-be.zenbytes.id/address/delete/${id}`, {
      method: "DELETE"
    });
  } catch (error) {
    console.log(error);
  }
};


const getAddressById = async (id) => {
  try {
    const res = await fetch(`https://bmp-inv-be.zenbytes.id/address/byId/${id}`);
    const data = await res.json();
    if (data?.data) {
      Object.assign(stateAddress, {
        ...data.data,
        province: data.data.provinceID, 
        city: data.data.cityID
      });
    }
  } catch (err) {
    console.log("Failed to fetch address by ID:", err);
  }
};




  return {
    stateAddress,
    getAllAddress,
    getOneAddress,
    newAddress,
    updateAddress,
    deleteAddress,
    editAddress,
    getAddressById
  }
}

export default getAddress
