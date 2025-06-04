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
            await fetch("https://bmp-inv-be.zenbytes.id/product/")
            .then(res=> res.json())
            .then(data=> {
                stateProduct.product = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getAllProductByWarehouse = async (warehouseId) => {
        try {
            const res = await fetch(`https://bmp-inv-be.zenbytes.id/product/byWarehouse/${warehouseId}`);
            const data = await res.json();
            stateProduct.product = data;
        } catch (error) {
            console.log("Error fetching products by warehouse:", error);
        }
    };


    const convertUnit = async (id, amount, price) => {
        const username = sessionStorage.getItem("username");
        try {
            const request = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, price })
            };
            const res = await fetch(`https://bmp-inv-be.zenbytes.id/product/convertByUser/${id}?username=${username}`, request);
            const data = await res.json();
            return data;
        } catch (error) {
            console.log("Error converting unit:", error);
        }
    };


    const getAllProductMainWarehouse = async () =>{
        try {
            await fetch("https://bmp-inv-be.zenbytes.id/product/getAllProductMainWarehouse")
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
            await fetch("https://bmp-inv-be.zenbytes.id/product/get/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateProduct.product = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneProductMainWarehouse = async (id) =>{
        try {
            await fetch("https://bmp-inv-be.zenbytes.id/product/getOneProductMainWarehouse/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateProduct.product = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newProduct = async () => {
        try {
            const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: stateProduct.newNameP,
                stock: stateProduct.newStock,
                category: stateProduct.newCategory,
                price: stateProduct.newPrice,
                description: stateProduct.newDesc,
                status: stateProduct.newStatus,
                warehouseId: stateProduct.newWarehouse
            })
            };

            const res = await fetch("https://bmp-inv-be.zenbytes.id/product/new", request);
            const data = await res.json();

            if (res.ok) {
            alert("Produk berhasil ditambahkan!");
            const productId = data.product.id;
            window.location.href = `/uploadImageProduct?id=${productId}`;
            } else {
            alert("Gagal menambahkan produk.");
            }
        } catch (error) {
            console.error("Product creation error:", error);
            alert("Terjadi kesalahan.");
        }
    };


    const updateStatusProduct = async (id, status) => {
        const username = sessionStorage.getItem("username");
        try {
            const request = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updateStatus: status })
            };
            await fetch(`https://bmp-inv-be.zenbytes.id/product/updateStatusByUser/${id}?username=${username}`, request);
        } catch (error) {
            console.log("Error updating status:", error);
        }
    };

    const restockProduct = async (id, stock) => {
        const username = sessionStorage.getItem("username");
        try {
            const request = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock })
            };
            await fetch(`https://bmp-inv-be.zenbytes.id/product/restockByUser/${id}?username=${username}`, request);
        } catch (error) {
            console.log("Error during restock:", error);
        }
    };


    const updateDescription = async (id, description) => {
        const username = sessionStorage.getItem("username");
        try {
            const request = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description })
            };
            await fetch(`https://bmp-inv-be.zenbytes.id/product/updateDescByUser/${id}?username=${username}`, request);
        } catch (error) {
            console.log("Error updating description:", error);
        }
    };

    const getProductByIdAndUser = async (id, username) => {
        try {
            const res = await fetch(`https://bmp-inv-be.zenbytes.id/product/getByIdAndUser?id=${id}&username=${username}`);
            const data = await res.json();
            stateProduct.product = data;
        } catch (error) {
            console.error("Error fetching product by ID and username:", error);
        }
    };



    return {
        stateProduct,
        getAllProduct,
        getOneProduct,
        stateMap,
        newProduct,
        restockProduct,
        getAllProductByWarehouse,
        updateDescription,
        getAllProductMainWarehouse,
        getOneProductMainWarehouse,
        convertUnit,
        updateStatusProduct,
        getProductByIdAndUser
    };
}

export default getProduct