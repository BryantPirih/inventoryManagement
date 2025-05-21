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
        api : {},
        proviceRAJA: {},
        cityRAJA: {}
    })
    
    const getOngkir = async (destinationCityId) => {
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                destination: destinationCityId
            }),
        };

        try {
            const response = await fetch("http://localhost:3000/rajaongkir/cekOngkir", request);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            stateAPI.api = data;
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error fetching Ongkir data:', error);
        }
    };

    const getAllProvince = async () =>{
        const request = {
            method : "get",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
        };
        try {
            const response = await fetch("http://localhost:3000/rajaongkir/allProvince", request);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            stateAPI.proviceRAJA = data; // Store the response data in stateAPI.api
            console.log('API Response:', data); // Log the response for debugging
        } catch (error) {
            console.error('Error fetching Ongkir data:', error); // Log the error
        }
        
    }
    
    const getAllCity = async () =>{
        const request = {
            method : "get",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
        };
        try {
            const response = await fetch("http://localhost:3000/rajaongkir/allCity", request);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            stateAPI.cityRAJA = data; // Store the response data in stateAPI.api
            console.log('API Response:', data); // Log the response for debugging
        } catch (error) {
            console.error('Error fetching Ongkir data:', error); // Log the error
        }
        
    }


    return {
        stateAPI,
        getOngkir,
        getAPI,
        getAllCity,
        getAllProvince
    }
}

export default getAPI