import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../card/ProductCard'

import { formatHour } from '../../utils/datetimeformat'

const NewProduct = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        await listProductBy('updatedAt', 'desc', 4)
            .then((res) => {
                setProducts(res.data)
                console.log(products)
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <p className='text-2xl text-center my-3'>NewProduct!</p>
            <div className='flex gap-14 items-center justify-center'>
                {
                    products.map((product, index) => {
                        return (
                            <div key={index} >
                                <div className='relative z-20'>
                                    <p className='z-10 absolute px-2 py-1 bg-red-400 shadow-md rounded-full right-1 top-1'>
                                        {formatHour(product.updatedAt)}
                                    </p>
                                </div>
                                <ProductCard product={product} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default NewProduct