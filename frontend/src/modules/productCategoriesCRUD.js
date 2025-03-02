import {reactive} from 'vue'

const getProductCategories =() =>{
    const statePC = reactive({
        newCN: '',
        newUnit: '',
        newUC: '',
        boolTF: '0',
        productCategories : {}
    })

    const getAllProductCategories = async () =>{
        try {
            await fetch("http://localhost:3000/productCategories/")
            .then(res=> res.json())
            .then(data=> {
                statePC.productCategories = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newPC = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                categoriesName: statePC.newCn ,
                unit: statePC.newUnit,
                unitConversion: statePC.newUC
            })
        }
        fetch("http://localhost:3000/productCategories/new",
        request
        )
    }

    return {
        statePC,
        getAllProductCategories,
        newPC
    }
}

export default getProductCategories