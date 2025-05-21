import {reactive} from 'vue'
import axios from 'axios'

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

    const getHistoryOrders = async () => {
        try {
            const res = await fetch("http://localhost:3000/order/history");
            const data = await res.json();
            stateOrder.order = data;
        } catch (err) {
            console.log("Error fetching history orders:", err);
        }
    };

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

    const updateOrder = async (id, newStatus, receivedBy = null) => {
        try {
            const payload = { newStatus };
            if (receivedBy) payload.receivedBy = receivedBy;

            const response = await axios.put(`http://localhost:3000/order/updateOrder/${id}`, payload);
            return response.data; // ✅ Return updated order
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Gagal mengupdate status");
        }
    };


    return {
        stateOrder,
        getAllOrder,
        getAllOrderUser,
        getOneOrder,
        getHistoryOrders,
        updateOrder
    }
}

export default getOrder