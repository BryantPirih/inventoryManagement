import {reactive} from 'vue'

const getWarehouse =() =>{
    const state = reactive({
        newWRHS: '',
        newAddress: '',
        newProvince: '',
        newCity: '',
        warehouse : {}
    })

    const getAllWarehouse = async () =>{
        try {
            await fetch("http://localhost:3000/warehouse/")
            .then(res=> res.json())
            .then(data=> {
                state.warehouse = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newWarehouse = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                warehouse: state.newWRHS ,
                address: state.newAddress,
                province : state.newProvince,
                city: state.newCity
            })
        }
        fetch("http://localhost:3000/warehouse/new",
        request
        )
    }

    return {
        state,
        getAllWarehouse,
        newWarehouse
    }
}

export default getWarehouse