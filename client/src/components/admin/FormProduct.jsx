import React, { useEffect, useState } from 'react'

import useEcomStore from '../../store/ecom-store'
import { createProduct } from '../../api/product'
import { toast } from 'react-toastify'
import UpdateFile from './UpdateFile'
import { Link, useNavigate } from 'react-router-dom'


const initialState = {
    title: "Core i5 14500",
    description: "description about i5",
    price: 599,
    quantity: 13,
    categoryId: '',
    images: []
}

const FromProduct = () => {
    const navigate = useNavigate()
    const token = useEcomStore((state) => state.token)

    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)

    const getProduct = useEcomStore((state) => state.getProduct)
    const products = useEcomStore((state) => state.products)

    const [form, setForm] = useState(initialState)

    useEffect(() => {
        getCategory(token)
        getProduct(token, 20)
    }, [])

    const handleOnChange = ((e) => {
        // console.log(e.target.name, e.target.value)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(form)
        try {
            const res = await createProduct(token, form)
            console.log(res)
            toast.success(`Add ${res.data.title} Qty ${res.data.quantity} success!`)
        } catch (err) {
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
                <hr />
                {/* upload file */}

                <UpdateFile form={form} setForm={setForm} />

                <button className='bg-blue-400'>Add Product</button>

                <hr />
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Picture</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Sold</th>
                            <th scope="col">Update date</th>
                            <th scope="col">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => navigate(`/admin/product/${item.id}`)}
                                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                                        role="button"
                                        aria-label={`Edit ${item.title}`}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        
                                        <td>
                                            {
                                                item.images.length > 0
                                                ? <img 
                                                    src={item.images[0].url}
                                                    className='w-24 h-24 rounded-lg shadow-sm'
                                                    />
                                                : <div className='w-24 h-24 bg-gray-200 rounded-sm flex items-center justify-center shadow-sm'>
                                                    No Image
                                                    </div>
                                            }    
                                        </td>



                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.sold}</td>
                                        <td>{item.updatedAt}</td>
                                        <td>
                                            <p className='bg-yellow-500 rounded-md p-1 shadow-md'>
                                                <Link to={'/admin/product/' + item.id}>
                                                    Edit
                                                </Link>
                                            </p>
                                            <p>Delete</p>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

            </form>
        </div>
    )
}

export default FromProduct