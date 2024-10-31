import React, { useEffect, useState} from 'react'

import useEcomStore from '../../store/ecom-store'

const FromProduct = () => {

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state)=>state.getCategory)
    const categories = useEcomStore((state)=>state.categories)

    useEffect(()=>{
        getCategory(token)
    },[])
    console.log(categories)
    return (
        <div>FromProduct</div>
    )
}

export default FromProduct