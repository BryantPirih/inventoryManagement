import axios from "axios";
import { reactive } from "vue";

const stateReturn = reactive({
  order: null,       // Used in returnRequest.vue
  returnList: [],    // 💡 Stores all return requests for logged-in user
});

// 📨 1. Submit return request (with file)
const submitReturnRequest = async ({ order, productId, reason, file }) => {
  try {
    const formData = new FormData();
    formData.append("orderId", order.id);
    formData.append("productId", productId);
    formData.append("username", order.username);
    formData.append("reason", reason);
    formData.append("file", file);

    await axios.post("http://localhost:3000/returnRequest/new", formData);
    return true;
  } catch (err) {
    console.error("❌ Gagal mengirim return request:", err.response?.data || err.message);
    return false;
  }
};

// 📦 2. Fetch return request by ID (admin detail view)
const getReturnRequestById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/returnRequest/get/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Gagal memuat permintaan retur:", err.response?.data || err.message);
    return null;
  }
};

// ✅ 3. Update return request status + optional adminNote
const updateReturnRequestStatus = async (id, { status, adminNote }) => {
  try {
    const res = await axios.put(`http://localhost:3000/returnRequest/status/${id}`, {
      status,
      adminNote,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Gagal memperbarui status retur:", err.response?.data || err.message);
    return null;
  }
};

// 🧾 4. Fetch all return requests by username (for user history UI)
const fetchUserReturns = async (username) => {
  try {
    const res = await axios.get(`http://localhost:3000/returnRequest/user/${username}`);
    stateReturn.returnList = res.data;
  } catch (err) {
    console.error("❌ Gagal mengambil data retur user:", err.response?.data || err.message);
  }
};

export default function returnCRUD() {
  return {
    stateReturn,
    submitReturnRequest,
    getReturnRequestById,
    updateReturnRequestStatus,
    fetchUserReturns,       // ✅ add this
  };
}
