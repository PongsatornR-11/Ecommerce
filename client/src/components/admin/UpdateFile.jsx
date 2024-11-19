import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFile, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
import { Loader } from "lucide-react";

const UpdateFile = (props) => {
  const { form, setForm } = props;

  const token = useEcomStore((state) => state.token);

  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    setIsLoading(true);
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allFiles = form.images;
      for (let i = 0; i < files.length; i++) {
        //Validate image
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File "${file.name}" is not an image`);
          continue;
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
              .then((res) => {
                // console.log(res)

                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                setIsLoading(false);
                toast.success("Upload image success!");
              })
              .catch((err) => {
                setIsLoading(false);
                console.log(err);
              });
          },
          "base64",
        );
      }
    }
  };

  const handleDelete = (public_id) => {
    const images = form.images;
    removeFile(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item, index) => {
          return item.public_id !== public_id;
        });
        console.log("filterImages", filterImages);
        setForm({
          ...form,
          images: filterImages,
        });
        toast.error(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="my-4">
      <div className="flex mx-4 gap-4 my-4">
        {isLoading && <Loader className="w-10 h-10 animate-spin" />}
        {form.images.map((item, index) => (
          <div className="relative" key={index}>
            <img className="w-24 h-24 hover:scale-105" src={item.url} />
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-400 p-1 rounded cursor-pointer"
            >
              x
            </span>
          </div>
        ))}
      </div>

      <div>
        <input onChange={handleOnChange} type="file" name="images" multiple />
      </div>
    </div>
  );
};

export default UpdateFile;
