import { reactive } from 'vue';

const stockOpnameCRUD = () => {
  const stateStockOpname = reactive({
    logs: [],
    warehouseLogs: []
  });

  // ✅ Get all stock opname logs
  const getAllOpnameLogs = async () => {
    try {
      const res = await fetch("http://localhost:3000/stockOpname");
      const data = await res.json();
      stateStockOpname.logs = data.data;
    } catch (error) {
      console.error("Error fetching all stock opname logs:", error);
    }
  };

  // ✅ Get logs by warehouse
  const getOpnameLogsByWarehouse = async (warehouseId) => {
    try {
      const res = await fetch("http://localhost:3000/stockOpname/" + warehouseId);
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
