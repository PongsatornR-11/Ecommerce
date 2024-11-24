import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'

const SearchCard = () => {

    const getProduct = useEcomStore((state) => state.getProduct)
    const products = useEcomStore((state) => state.products)
    const actionSearchFilter = useEcomStore((state) => state.actionSearchFilter)

    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)

    const [text, setText] = useState('')
    const [categoryChecked, setCategoryChecked] = useState([])

    useEffect(() => {
        getCategory()
    }, [])

    // step 1 Search by Text
    useEffect(() => {
        const delay = setTimeout(() => {
            if (text) {
                actionSearchFilter({ query: text })
            } else {
                getProduct()
            }
        }, 300);
        return () => clearTimeout(delay)
    }, [text])

    // step 2 Search by Cetegory
    const handleCheckbox = (e) => {
        const inCheck = e.target.value
        const inState = [...categoryChecked]
        const findCheck = inState.indexOf(inCheck)
        if (findCheck === -1) {
            inState.push(inCheck)
        } else {
            inState.splice(findCheck, 1)
        }
        setCategoryChecked(inState)
        if (inState.length > 0) {
            actionSearchFilter({ category: inState })
        } else {
            getProduct()
        }
    }
    // step 3 Search by price

    return (
        <div>
            <h1 className='text-xl font-bold mb-4'>Find Product</h1>
            {/* Search by Text */}
            <input
                onChange={(e) => setText(e.target.value)}
                type='text'
                placeholder='Find Product...'
                className='border rounded-md w-full mb-4'
            />
            <hr />
            {/* Search by Category */}
            <div>
                <h1>Categories</h1>
                <div>
                    {categories.map((item, index) =>
                        <div className='flex items-center gap-2' key={index}>
                            <input
                                type='checkbox'
                                value={item.id}
                                onChange={handleCheckbox}
                            />
                            <label>{item.name}</label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchCard