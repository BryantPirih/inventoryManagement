import {reactive} from 'vue'

const getCityAndProvince =() =>{
    const stateCnP = reactive({
        province: [],
        city: []
    })
    const getAllProvince = async () =>{
        try {
            await fetch("http://localhost:3000/province/")
            .then(res=> res.json())
            .then(data=> {
                stateCnP.province = data
            });
        } catch (error) {
            console.log(error)
        }
    }
    const getAllCity = async () =>{
        try {
            await fetch("http://localhost:3000/cities/")
            .then(res=> res.json())
            .then(data=> {
                stateCnP.city = data
            });
        } catch (error) {
            console.log(error)
        }
    }
    return {
        stateCnP,
        getAllCity,
        getAllProvince
    }
}

export default getCityAndProvince