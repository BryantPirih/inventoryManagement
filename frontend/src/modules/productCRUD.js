import {reactive} from 'vue'

const getProduct =() =>{
    const stateProduct = reactive({
        newNameP: '',
        newStock: '',
        newCategory: '',
        newPrice: '',
        newDesc: '',
        newStatus: '',
        newWarehouse: '',
        jumlahKeranjang : 1,
        product : {}
    })

    const stateMap = reactive({
        product : {}
    })


    const getAllProduct = async () =>{
        try {
            await fetch("http://localhost:3000/product/")
            .then(res=> res.json())
            .then(data=> {
                stateProduct.product = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneProduct = async (id) =>{
        try {
            await fetch("http://localhost:3000/product/get/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateProduct.product = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newProduct = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                name: stateProduct.newNameP,
                stock: stateProduct.newStock,
                category: stateProduct.newCategory,
                price: stateProduct.newPrice,
                description: stateProduct.newDesc,
                status: stateProduct.newStatus,
                warehouseId : stateProduct.newWarehouse
            })
        }
        fetch("http://localhost:3000/product/new",
        request
        )
    }

    const updateStatusProduct = async (id,status) =>{
        try {
            const request = {
                method : "PUT",
                headers: {
                    "Content-Type" : "application/json"
                    //authtoken bisa disini
                },
                body: JSON.stringify({
                    updateStatus: status,
                })
            }
            fetch("http://localhost:3000/product/updateStatusProduct/"+id,
            request
            )
        } catch (error) {
            console.log(error)
        }
    }
    const updateProduct = async (id,newStock,newDescription) =>{
        try {
            const request = {
                method : "PUT",
                headers: {
                    "Content-Type" : "application/json"
                    //authtoken bisa disini
                },
                body: JSON.stringify({
                    newStock: newStock,
                    newDescription : newDescription
                })
            }
            fetch("http://localhost:3000/product/updateProduct/"+id,
            request
            )
        } catch (error) {
            console.log(error)
        }
    }

    return {
        stateProduct,
        getAllProduct,
        getOneProduct,
        stateMap,
        newProduct,
        updateProduct,
        updateStatusProduct
    }
}

export default getProduct