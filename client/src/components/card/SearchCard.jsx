import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'

const SearchCard = () => {

    const getProduct = useEcomStore((state) => state.getProduct)
    const products = useEcomStore((state) => state.products)
    const actionSearchFilter = useEcomStore((state) => state.actionSearchFilter)

    const [text, setText] = useState('')

    // step 1 Search by Text

    useEffect(() => {
        const delay = setTimeout(() => {
            actionSearchFilter({ query: text })
            if (!text) {
                getProduct()
            }
        }, 300);

        return () => clearTimeout(delay)
    }, [text])

    // step 2 Search by Cetegory

    // step 3 Search by price

    return (
        <div>
            <h1 className='text-xl font-bold mb-4'>Find Product</h1>

            <input
                onChange={(e) => setText(e.target.value)}
                type='text'
                placeholder='Find Product...'
                className='border rounded-md w-full mb-4'
            />
        </div>
    )
}

export default SearchCard