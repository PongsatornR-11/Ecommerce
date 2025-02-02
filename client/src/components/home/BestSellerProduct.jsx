import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../card/ProductCard'

const BestSellerProduct = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {

        loadData()
    }, [])

    const loadData = () => {
        listProductBy('sold', 'desc', 4)
            .then((res) => {
                console.log(res.data)
                setProducts(res.data)
            })
            .catch((err) => console.log(err))
    }
    return (
        <div>
            <p className="text-2xl text-center my-3">Best seller!</p>
            <div className='flex gap-14 items-center justify-center'>
                {
                    products?.map((product, index) => {
                        return (
                            <ProductCard key={index} product={product} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BestSellerProduct