import React, { useEffect, useState } from 'react'

import useEcomStore from '../../store/ecom-store'
import { createProduct } from '../../api/product'


const initialState = {
    title: "Core i5 14500",
    description: "description about i5",
    price: 599,
    quantity: 13,
    categoryId: '',
    images: []
}


const FromProduct = () => {

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        getCategory(token)
    }, [])
    console.log(categories)

    const handleOnChange = ((e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    })

    const handleSubmit = async (e)=>{
        e.preventDefault()
        console.log(form)
        try{
            const res = await createProduct(token, form)
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className='container mx-auto p-4 bg-[#ffffff] shadow-md'>
            <form onSubmit={handleSubmit}>
                <h1>Add Product details</h1>
                <input
                    className='border'
                    value={form.title}
                    onChange={handleOnChange}
                    placeholder='Enter product name here'
                    name='title'
                />
                <input
                    className='border'
                    value={form.description}
                    onChange={handleOnChange}
                    placeholder='Enter product here'
                    name='description'
                />
                <input
                    className='border'
                    type='number'
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder='Enter price here'
                    name='price'
                />
                <input
                    className='border'
                    type='number'
                    value={form.quantity}
                    onChange={handleOnChange}
                    placeholder='Enter quantity here'
                    name='quantity'
                />
                <select
                    className='border'
                    name='categoryId'
                    onChange={handleOnChange}
                    required
                    value={form.categoryId}
                >
                    <option value='' disabled>Please Select</option>
                    {
                        categories.map((item, index) =>
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        )
                    }
                </select>
                <hr/>
                <button className='bg-blue-400'>Add Product</button>
            </form>
        </div>
    )
}

export default FromProduct