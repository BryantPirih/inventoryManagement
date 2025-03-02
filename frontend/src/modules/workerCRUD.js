import {reactive} from 'vue'

const getWorker =() =>{
    const stateWorker = reactive({
        newName: '',
        newUsername: '',
        newEmail: '',
        newRole: '',
        newMobilephone: '',
        newWarehouseId: '',
        newPassword: '',
        workers : {}
    })

    const getAllWorker = async () =>{
        try {
            await fetch("http://localhost:3000/worker/")
            .then(res=> res.json())
            .then(data=> {
                stateWorker.workers = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newWorker = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                username: stateWorker.newUsername ,
                name: stateWorker.newName ,
                email: stateWorker.newEmail ,
                role: stateWorker.newRole ,
                mobilePhone: stateWorker.newMobilephone ,
                warehouseId: stateWorker.newWarehouseId ,
                password: stateWorker.newPassword
            })
        }
        fetch("http://localhost:3000/worker/new",
        request
        )
    }

    return {
        stateWorker,
        getAllWorker,
        newWorker
    }
}

export default getWorker