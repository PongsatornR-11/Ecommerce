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
    <div className="space-y-4">
      {/* Uploaded Images Preview */}
      <div className="flex flex-wrap gap-4">
        {isLoading && (
          <div className="w-24 h-24 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm flex-none">
            <Loader className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        {form.images.map((item, index) => (
          <div className="relative group flex-none" key={index}>
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250" src={item.url} alt={`product-img-${index}`} />
            </div>
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold cursor-pointer shadow-sm transition-colors"
              title="Remove image"
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* File Selector */}
      <div className="pt-2">
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input 
            onChange={handleOnChange} 
            type="file" 
            name="images" 
            multiple 
            className="block w-full text-xs text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-xs file:font-semibold
              file:bg-indigo-50 dark:file:bg-indigo-950/40
              file:text-indigo-600 dark:file:text-indigo-455
              hover:file:bg-indigo-100 dark:hover:file:bg-indigo-950/70
              file:cursor-pointer cursor-pointer transition-all"
          />
        </label>
      </div>
    </div>
  );
};

export default UpdateFile;
