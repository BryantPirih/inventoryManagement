import {reactive} from 'vue'

const getAddress =() =>{
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
        address : {}
    })

    const getAllAddress = async () =>{
        try {
            await fetch("http://localhost:3000/address/")
            .then(res=> res.json())
            .then(data=> {
                stateAddress.address = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneAddress = async (username) =>{
        try {
            await fetch("http://localhost:3000/address/get/"+username)
            .then(res=> res.json())
            .then(data=> {
                stateAddress.address = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newAddress = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                username: stateAddress.newUsername,
                fullAddress : stateAddress.fullAddress,
                province : stateAddress.province,
                city : stateAddress.city,
                district : stateAddress.district,
                subDistrict : stateAddress.subDistrict,
                postalCode : stateAddress.postalCode,
                recipientName : stateAddress.recipientName,
                recipientEmail : stateAddress.recipientEmail,
                recipientPhone : stateAddress.recipientPhone,
            })
        }
        fetch("http://localhost:3000/address/new",
        request
        )
    }

    return {
        stateAddress,
        getAllAddress,
        getOneAddress,
        newAddress
    }
}

export default getAddress