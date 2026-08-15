import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFile, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
import { Loader2, UploadCloud, X } from "lucide-react";

const UpdateFile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      let allFiles = [...(form.images || [])];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`"${file.name}" is not an image format`);
          continue;
        }

        Resize.imageFileResizer(
          file,
          800,
          800,
          "JPEG",
          95,
          0,
          (data) => {
            uploadFiles(token, data)
              .then((res) => {
                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                toast.success("Image asset uploaded!");
              })
              .catch((err) => {
                console.log(err);
                toast.error("Failed to upload image asset");
              })
              .finally(() => {
                setIsLoading(false);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleDelete = (public_id) => {
    const images = form.images || [];
    removeFile(token, public_id)
      .then(() => {
        const filtered = images.filter((item) => item.public_id !== public_id);
        setForm({
          ...form,
          images: filtered,
        });
        toast.info("Image asset removed");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Area */}
      <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
        </div>
        <span className="text-xs font-bold text-slate-800">Click to upload product photography</span>
        <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WebP up to 5MB (auto-compressed)</span>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleOnChange}
          className="hidden"
          accept="image/*"
        />
      </label>

      {/* Thumbnails Preview Grid */}
      {form.images && form.images.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2">
          {form.images.map((item, idx) => (
            <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
              <img src={item.url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(item.public_id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                title="Remove picture"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateFile;
