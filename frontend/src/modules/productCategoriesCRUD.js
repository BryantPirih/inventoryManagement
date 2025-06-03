import { reactive } from 'vue'

const getProductCategories = () => {
  const statePC = reactive({
    newCN: '',
    newUnit: '',
    newUC: '',
    newConversionRate: 1,
    boolTF: '0',
    productCategories: {}
  })

  const getAllProductCategories = async () => {
    try {
      const res = await fetch("https://bmp-inv-be.zenbytes.id/productCategories/")
      const data = await res.json()
      statePC.productCategories = data
    } catch (error) {
      console.log(error)
    }
  }

  const newPC = async () => {
    try {
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          categoriesName: statePC.newCn,
          unit: statePC.newUnit,
          unitConversion: statePC.newUC,
          conversionRate: statePC.newConversionRate
        })
      };

      const res = await fetch("https://bmp-inv-be.zenbytes.id/productCategories/new", request);
      const data = await res.json();

      if (res.ok) {
        // ✅ Return new category ID to the component to handle redirect
        return data.categories.id;
      } else {
        throw new Error("Gagal menambahkan kategori");
      }
    } catch (error) {
      console.log(error);
      throw error; // Let the component handle the error
    }
  };



  const deleteProductCategory = async (id) => {
    try {
      await fetch(`https://bmp-inv-be.zenbytes.id/productCategories/${id}`, {
        method: 'DELETE'
      })
      // Refresh after deletion
      await getAllProductCategories()
    } catch (error) {
      console.log(error)
    }
  }

  return {
    statePC,
    getAllProductCategories,
    newPC,
    deleteProductCategory
  }
}

export default getProductCategories
