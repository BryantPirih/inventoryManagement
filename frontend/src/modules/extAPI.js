import {reactive} from 'vue'

const getAPI =() =>{
    const stateAPI = reactive({
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
        api : {}
    })
    
    const getOngkir = async () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                origin: '444',
                destination: '247',
                weight: 1000,
                courier: 'jne'
            }),
        };
        try {
            const response = await fetch("http://localhost:3000/rajaongkir/cekOngkir", request);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            stateAPI.api = data; // Store the response data in stateAPI.api
            console.log('API Response:', data); // Log the response for debugging
        } catch (error) {
            console.error('Error fetching Ongkir data:', error); // Log the error
        }
        
    }

    return {
        stateAPI,
        getOngkir,
        getAPI
    }
}

export default getAPI