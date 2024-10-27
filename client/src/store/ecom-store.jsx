import axios from 'axios'
import { create } from 'zustand'

const ecomStore = (set) =>({
    user : null,
    token : null,
    actionLogin: async (form)=>{
        const res = await axios.post('http://localhost:5000/api/login', form)
        console.log(res.data.token)
        return res
    }
})

const useEcomStore = create(ecomStore)

export default useEcomStore