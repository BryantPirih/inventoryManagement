import {reactive} from 'vue'

const getOrder =() =>{
    const stateOrder = reactive({
        order : {}
    })

    const getAllOrder = async () =>{
        try {
            await fetch("http://localhost:3000/order/")
            .then(res=> res.json())
            .then(data=> {
                stateOrder.order = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneOrder = async (id) =>{
        try {
            await fetch("http://localhost:3000/order/get/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateOrder.order = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getAllOrderUser = async (username) =>{
        try {
            await fetch("http://localhost:3000/order/getAllOrderUser/"+username)
            .then(res=> res.json())
            .then(data=> {
                stateOrder.order = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const updateOrder = async (id,status) =>{
        try {
            const request = {
                method : "PUT",
                headers: {
                    "Content-Type" : "application/json"
                    //authtoken bisa disini
                },
                body: JSON.stringify({
                    updateStatus: status,
                })
            }
            fetch("http://localhost:3000/order/updateOrder/"+id,
            request
            )
        } catch (error) {
            console.log(error)
        }
    }

    return {
        stateOrder,
        getAllOrder,
        getAllOrderUser,
        getOneOrder,
        updateOrder
    }
}

export default getOrder