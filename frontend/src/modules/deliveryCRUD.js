// modules/deliveryCRUD.js
import { reactive } from 'vue';
import axios from 'axios';

const deliveryCRUD = () => {
  const stateDelivery = reactive({
    delivery: {} // stores created or fetched delivery
  });

  // ✅ Create a new delivery
  const createDelivery = async (payload) => {
    try {
      const res = await axios.post("https://bmp-inv-be.zenbytes.id/delivery/new", payload);
      stateDelivery.delivery = res.data.delivery;
      return res.data.delivery; // return for chaining
    } catch (err) {
      console.log("Error creating delivery:", err);
    }
  };

  // ✅ Get delivery by order ID
  const getDeliveryByOrderId = async (orderId) => {
    try {
      const res = await axios.get(`https://bmp-inv-be.zenbytes.id/delivery/${orderId}`);
      stateDelivery.delivery = res.data.delivery;
    } catch (err) {
      console.log("Error fetching delivery by orderId:", err);
    }
  };

  return {
    stateDelivery,
    createDelivery,
    getDeliveryByOrderId
  };
};

export default deliveryCRUD;
