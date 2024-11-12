import axios from 'axios'

export const createProduct = async (token, form) => {

    return await axios.post('http://localhost:5000/api/product', form,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const listProduct = async (token, count = 20) => {

    return await axios.get(`http://localhost:5000/api/products/${count}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const uploadFiles = async (token, form) => {
    return await axios.post('http://localhost:5000/api/images',
        {
            image: form
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export const removeFile = async (token, public_id) => {
    return await axios.post(
        'http://localhost:5000/api/removeimages',
        {
            public_id
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}