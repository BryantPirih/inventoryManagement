import {reactive} from 'vue'
import axios from 'axios'

const getOrder =() =>{
    const stateOrder = reactive({
        order : {}
    })

    const getAllOrder = async () =>{
        try {
            await fetch("https://bmp-inv-be.zenbytes.id/order/")
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
            const res = await fetch("https://bmp-inv-be.zenbytes.id/order/history");
            const data = await res.json();
            stateOrder.order = data;
        } catch (err) {
            console.log("Error fetching history orders:", err);
        }
    };

    const getOneOrder = async (id) =>{
        try {
            await fetch("https://bmp-inv-be.zenbytes.id/order/get/"+id)
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
            await fetch("https://bmp-inv-be.zenbytes.id/order/getAllOrderUser/"+username)
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

            const response = await axios.put(`https://bmp-inv-be.zenbytes.id/order/updateOrder/${id}`, payload);
            return response.data; // ✅ Return updated order
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Gagal mengupdate status");
        }
    };

    const updateOrderDeliveryId = async (id, deliveryId) => {
        try {
            const res = await axios.put(`https://bmp-inv-be.zenbytes.id/order/update/${id}`, {
            deliveryId,
            });
            return res.data;
        } catch (error) {
            console.log("Error updating delivery ID:", error);
        }
    };



    return {
        stateOrder,
        getAllOrder,
        getAllOrderUser,
        updateOrderDeliveryId,
        getOneOrder,
        getHistoryOrders,
        updateOrder
    }
}

export default getOrder