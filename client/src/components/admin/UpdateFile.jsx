import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'


const UpdateFile = (props) => {
    const { form, setForm } = props

    const token = useEcomStore((state) => state.token)

    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {
        const files = e.target.files
        if (files) {
            setIsLoading(true)
            let allFiles = form.images
            for (let i = 0; i < files.length; i++) {

                // console.log(files[i])

                //Validate image
                const file = files[i]
                if (!file.type.startsWith('image/')) {
                    toast.error(`File "${file.name}" is not an image`)
                    continue
                }

                // Image Resize from react-image-file-resizer
                Resize.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data) => {
                        // endpoint Backend
                        uploadFiles(token, data)
                        .then((res)=>{
                            // console.log(res)

                            allFiles.push(res.data)
                            setForm({
                                ...form,
                                images: allFiles
                            })

                            console.log('form', form)
                            toast.success('Upload image success!')
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                    },
                    "base64"

                )
            }
        }
    }
    return (
        <div>
            <input
                onChange={handleOnChange}
                type='file'
                name='images'
                multiple
            />
        </div>
    )
}

export default UpdateFile