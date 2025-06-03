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
            await fetch("https://bmp-inv-be.zenbytes.id/warehouse/")
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
        fetch("https://bmp-inv-be.zenbytes.id/warehouse/new",
        request
        )
    }
    const deleteWarehouse = async (id) => {
        try {
            const res = await fetch(`https://bmp-inv-be.zenbytes.id/warehouse/${id}`, {
            method: 'DELETE',
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error deleting warehouse:", err);
        }
    };


    return {
        state,
        getAllWarehouse,
        newWarehouse,
        deleteWarehouse
    }
}

export default getWarehouse