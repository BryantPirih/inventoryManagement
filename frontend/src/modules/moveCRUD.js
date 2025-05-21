import { reactive } from 'vue'

const moveCRUD = () => {
  const stateMove = reactive({
    newRequester: '',
    move: {},        // all moves
    selectedMove: {}, // one move
  })

  // ✅ Get all move headers
  const getAllMove = async () => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/move/");
      const data = await res.json();
      stateMove.move = data;
    } catch (error) {
      console.log("Error fetching all moves:", error);
    }
  }

  // ✅ Get one move by ID
  const getOneMove = async (id) => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/move/get/" + id);
      const data = await res.json();
      stateMove.move = data;
    } catch (error) {
      console.log("Error fetching one move:", error);
    }
  }

  // ✅ Create new move (returns move object)
  const createMove = async () => {
    try {
      const request = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester: stateMove.newRequester
        })
      };
      const res = await fetch("https://bmp-inv-be.zenbytes.id/move/new", request);
      const data = await res.json();
      return data.move; // ← used by UI to get move.id
    } catch (error) {
      console.log("Error creating move:", error);
    }
  }

  const getMoveByUsernameWarehouse = async (username) => {
  try {
    const res = await fetch(`https://bmp-inv-be.zenbytes.id/move/byWarehouseUser/${username}`);
    const data = await res.json();
    stateMove.move = data;
  } catch (error) {
    console.log("Error fetching move list by user warehouse:", error);
  }
};


  // ✅ Update move status
  const updateMove = async (id, status, approver) => {
    try {
      const request = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updateStatus: status,
          approver: approver,
        })
      };
      const res = await fetch("https://bmp-inv-be.zenbytes.id/move/updateMove/" + id, request);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error updating move:", error);
    }
  }

  return {
    stateMove,
    createMove,
    getAllMove,
    getOneMove,
    updateMove,
    getMoveByUsernameWarehouse,
  }
}

export default moveCRUD;
