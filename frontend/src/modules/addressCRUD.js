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
          provinceID: stateAddress.province,
          cityID: stateAddress.city,
          district: stateAddress.district,
          subDistrict: stateAddress.subDistrict,
          postalCode: stateAddress.postalCode,
          recipientName: stateAddress.recipientName,
          recipientEmail: stateAddress.recipientEmail,
          recipientPhone: stateAddress.recipientPhone,
          isDefault: 1 // non-default by default, will be updated later if needed
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

  return {
    stateAddress,
    getAllAddress,
    getOneAddress,
    newAddress,
    updateAddress
  }
}

export default getAddress
