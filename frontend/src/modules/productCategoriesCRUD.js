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
        alert("Kategori berhasil ditambahkan!");
        const categoryId = data.categories.id;
        window.location.href = `/uploadImageProductCategories?id=${categoryId}`;
      } else {
        alert("Gagal menambahkan kategori.");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat menambahkan kategori.");
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
