import {reactive} from 'vue'

const getUsers =() =>{
    const stateUser = reactive({
        newUsername: '',
        newFullname: '',
        newEmail: '',
        newRole: '4',
        newMobilePhone: '',
        newPassword: '',
        user : {}
    })

    const getAllUser = async () =>{
        try {
            await fetch("http://localhost:3000/user/")
            .then(res=> res.json())
            .then(data=> {
                stateUser.user = data
            });
        } catch (error) {
            console.log(error)
        }
    }

    const newUser = () =>{
        console.log('clicked')
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                username: stateUser.newUsername ,
                email: stateUser.newEmail ,
                role: stateUser.newRole ,
                mobilePhone: stateUser.newMobilePhone ,
                fullName: stateUser.newFullname ,
                password: stateUser.newPassword 
            })
        }
        fetch("http://localhost:3000/user/new",
        request
        )
    }
    


    return {
        stateUser,
        getAllUser,
        newUser
    }
}

export default getUsers