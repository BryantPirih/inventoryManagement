import { reactive } from 'vue'

const moveProductCRUD = () => {
  const stateMoveProduct = reactive({
    moveProducts: {},  // product list by moveId
  })

  // ✅ Create move product list
  const createMoveProduct = async (moveId, products) => {
    try {
      const request = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moveId, products }),
      }

      const res = await fetch("http://localhost:3000/moveProduct/new", request)
      const data = await res.json()
      return data
    } catch (error) {
      console.log("Error creating move product list:", error)
    }
  }

  // ✅ Get move product list for a move
  const getMoveProduct = async (moveId) => {
    try {
      const res = await fetch("http://localhost:3000/moveProduct/" + moveId)
      const data = await res.json()
      stateMoveProduct.moveProducts = data
    } catch (error) {
      console.log("Error fetching move product:", error)
    }
  }

  // ✅ Finalize move (create stock in destination warehouse)
  const finalizeMove = async (moveId) => {
    try {
      const request = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }

      const res = await fetch("http://localhost:3000/moveProduct/finalize/" + moveId, request)
      const data = await res.json()
      return data
    } catch (error) {
      console.log("Error finalizing move:", error)
    }
  }

  return {
    stateMoveProduct,
    createMoveProduct,
    getMoveProduct,
    finalizeMove,
  }
}

export default moveProductCRUD
