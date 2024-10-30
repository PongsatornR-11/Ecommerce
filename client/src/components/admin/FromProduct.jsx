import React, { useEffect, useState} from 'react'

import useEcomStore from '../../store/ecom-store'

const FromProduct = () => {

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state)=>state.getCategory)

    return (
        <div>FromProduct</div>
    )
}

export default FromProduct