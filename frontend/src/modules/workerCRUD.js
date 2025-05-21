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
            const username = sessionStorage.getItem("username");
            const role = sessionStorage.getItem("role");


            await fetch(`http://localhost:3000/worker?username=${username}&role=${role}`)
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

    const getOneWorker = async (username) => {
    try {
      const res = await fetch(`http://localhost:3000/worker/get/${username}`)
      const data = await res.json()
      stateWorker.workers = data 
    } catch (error) {
      console.log(error)
    }
  }

    return {
        stateWorker,
        getAllWorker,
        getOneWorker,
        newWorker
    }
}

export default getWorker