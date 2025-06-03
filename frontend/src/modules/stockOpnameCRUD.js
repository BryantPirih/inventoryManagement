import { reactive } from 'vue';

const stockOpnameCRUD = () => {
  const stateStockOpname = reactive({
    logs: [],
    warehouseLogs: []
  });

  // ✅ Get all stock opname logs
const getAllOpnameLogs = async () => {
  try {
    const username = sessionStorage.getItem("username");
    const res = await fetch(`https://bmp-inv-be.zenbytes.id/stockOpname?username=${username}`);
    const data = await res.json();
    stateStockOpname.logs = data.data;
  } catch (error) {
    console.error("Error fetching all stock opname logs:", error);
  }
};


  // ✅ Get logs by warehouse
  const getOpnameLogsByWarehouse = async (warehouseId) => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/stockOpname/" + warehouseId);
      const data = await res.json();
      stateStockOpname.warehouseLogs = data.data;
    } catch (error) {
      console.error("Error fetching warehouse-specific logs:", error);
    }
  };

  return {
    stateStockOpname,
    getAllOpnameLogs,
    getOpnameLogsByWarehouse
  };
};

export default stockOpnameCRUD;
