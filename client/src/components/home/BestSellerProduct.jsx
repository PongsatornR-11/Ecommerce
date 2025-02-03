import React, { useEffect, useState } from 'react'
import { listProductBy } from '../../api/product'
import ProductCard from '../card/ProductCard'

const BestSellerProduct = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        const updateProductCount = () => {
            const width = window.innerWidth;
            const additionalProducts = Math.floor((width - 1080) / 200);
            return 4 + additionalProducts;
        };

        listProductBy('sold', 'desc', updateProductCount())
            .then((res) => {
                setProducts(res.data)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        const handleResize = () => {
            loadData();
        };
        window.addEventListener('resize', handleResize);
        loadData();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div>
            <p className="text-2xl text-center my-3">Best seller!</p>
            <div className='flex gap-14 items-center justify-center'>
                {
                    products?.map((product, index) => {
                        return (
                            <div key={index}>
                                <div className='relative z-20'>
                                    <p className='z-10 absolute px-2 py-1 bg-red-400 shadow-md rounded-full right-1 top-1'>
                                        {product.sold}
                                        <span className='text-xs px-0.5'>
                                            Sold!
                                        </span>
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

export default BestSellerProduct