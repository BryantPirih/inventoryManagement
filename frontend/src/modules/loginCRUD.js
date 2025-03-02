import {reactive} from 'vue'

const doLogin =() =>{

    const stateLogin = reactive({
        newInput: '',
        passwordInput: ''
    })


    const login = () =>{
        const request = {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
                //authtoken bisa disini
            },
            body: JSON.stringify({
                input: stateLogin.newInput ,
                password: stateLogin.passwordInput ,
            })
        }
        fetch("http://localhost:3000/user/login",
        request
        )
    }

    return {
        stateLogin,
        login
    }
}

export default doLogin