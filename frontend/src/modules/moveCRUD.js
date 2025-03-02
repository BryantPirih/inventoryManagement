import {reactive} from 'vue'

const getMove =() =>{
    const stateMove = reactive({
        newRequester: '',
        newProduct: '',
        newQuantity: '',
        move : {},
        moveProduct:{}
    })

    const getAllMove = async () =>{
        try {
            await fetch("http://localhost:3000/move/")
            .then(res=> res.json())
            .then(data=> {
                stateMove.move = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneMove = async (id) =>{
        try {
            await fetch("http://localhost:3000/move/get/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateMove.move = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const getOneMoveProduct = async (id) =>{
        try {
            await fetch("http://localhost:3000/move/getMoveProduct/"+id)
            .then(res=> res.json())
            .then(data=> {
                stateMove.moveProduct = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newMove = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                requester: stateMove.newRequester,
                product: stateMove.newProduct,
                quantity: stateMove.newQuantity
            })
        }
        fetch("http://localhost:3000/move/new",
        request
        )
    }

    const updateMove = async (id,status,approver) =>{
        try {
            const request = {
                method : "PUT",
                headers: {
                    "Content-Type" : "application/json"
                    //authtoken bisa disini
                },
                body: JSON.stringify({
                    updateStatus: status,
                    approver: approver,
                })
            }
            fetch("http://localhost:3000/move/updateMove/"+id,
            request
            )
        } catch (error) {
            console.log(error)
        }
    }

    return {
        stateMove,
        newMove,
        getAllMove,
        getOneMove,
        getOneMoveProduct,
        updateMove
    }
}

export default getMove