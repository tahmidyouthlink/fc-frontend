import Image from "next/image";
import toast from "react-hot-toast";
import { MdCancel } from "react-icons/md";
import fileUploadSVG from "@/public/return-order/upload.svg";
import { useLoading } from "@/app/contexts/loading";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";

const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const apiURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export default function ReturnImagesField({
  register,
  trigger,
  errors,
  isFormSubmissionRequested,
  setIsFormSubmissionRequested,
  imgFiles,
  setImgFiles,
  returnImgUrls,
  setReturnImgUrls,
}) {
  const { setIsPageLoading } = useLoading();
  const axiosPublic = useAxiosPublic();

  const updateDropZoneStyles = (event, state) => {
    const dropZoneElement = event.currentTarget;
    const uploadImageElement = event.currentTarget.querySelector("img");

    if (state === "enter") {
      dropZoneElement.style.borderColor = "#a1c99c";
      dropZoneElement.style.backgroundColor = "#fafff9";
      uploadImageElement.style.opacity = "1";
    } else {
      dropZoneElement.style.borderColor = "#e5e5e5";
      dropZoneElement.style.backgroundColor = "transparent";
      uploadImageElement.style.opacity = "0.6";
    }
  };

  const uploadImagesToGCS = async (images) => {
    const imageUrls = [];

    try {
      const formData = new FormData();

      for (const image of images) {
        formData.append("file", image); // Use 'file' for each image
      }

      const response = await axiosPublic.post(
        "/upload-multiple-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.urls && Array.isArray(response.data.urls)) {
        imageUrls.push(...response.data.urls);
      } else {
        toast.error("Failed to get image URLs from response.");
      }
    } catch (error) {
      toast.error(
        `Upload failed: ${error.response?.data?.error?.message || error.message}`,
      );
    }

    return imageUrls;
  };

  const validateFiles = async (uploadedFiles) => {
    // At least one file must be uploaded
    if (!uploadedFiles.length) {
      return "At least one image is required!";
    }

    for (let uploadedFile of uploadedFiles) {
      // Only image formats are allowed
      if (!uploadedFile.type.startsWith("image/")) {
        return "Only image formats are allowed.";
      }

      // Duplicate images are not allowed (by name)
      if (
        imgFiles.some((proofImage) => proofImage.name === uploadedFile.name)
      ) {
        return "Duplicate images are not allowed.";
      }

      // Max file size for each image is 10 MB
      if (uploadedFile.size > 10 * 1024 * 1024 /* 10 MB */) {
        return `The file ${uploadedFile.name} exceeds the 10MB size limit.`;
      }
    }

    // Maximum 5 files
    if (imgFiles.length + uploadedFiles.length > 5) {
      return "You can upload up to 5 images.";
    }

    setIsPageLoading(true);

    const newImgUrls = await uploadImagesToGCS(uploadedFiles);

    setReturnImgUrls((prevImgUrls) => [
      ...new Set([...prevImgUrls, ...newImgUrls]),
    ]);
    setImgFiles((prevFiles) => [...new Set([...prevFiles, ...uploadedFiles])]);

    setIsPageLoading(false);

    return true;
  };

  return (
    <div className="w-full space-y-3 font-semibold">
      <label htmlFor="description">Upload Images as Proof</label>
      <div
        className="cursor-pointer rounded-lg border-3 border-dashed border-neutral-200 px-5 py-8 transition-[border-color,background-color] duration-300 ease-in-out"
        onDrop={(event) => {
          event.preventDefault();
          if (isFormSubmissionRequested) setIsFormSubmissionRequested(false);

          const inputElement = event.currentTarget.querySelector("input");

          inputElement.files = event.dataTransfer.files;
          inputElement.dispatchEvent(new Event("change", { bubbles: true }));
        }}
        onDragOver={(event) => {
          event.preventDefault();
          updateDropZoneStyles(event, "enter");
        }}
        onDragLeave={(event) => updateDropZoneStyles(event, "leave")}
        onMouseEnter={(event) => updateDropZoneStyles(event, "enter")}
        onMouseLeave={(event) => updateDropZoneStyles(event, "leave")}
        onClick={(event) => {
          if (isFormSubmissionRequested) setIsFormSubmissionRequested(false);

          const inputElement = event.currentTarget.querySelector("input");
          inputElement.value = "";
          inputElement.click();
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
          <Image
            src={fileUploadSVG}
            alt="Upload image"
            className="size-16 opacity-60 transition-opacity duration-300 ease-in-out"
          />
          <p className="text-[13px]">
            <span className="text-[#57944e] underline underline-offset-2 transition-[color] duration-300 ease-in-out hover:text-[#6cb461]">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-[11px]">Maximum file size is 10 MB</p>
        </div>
        <input
          id="img-input"
          type="file"
          {...register("images", {
            onChange: () => trigger("images"),
            required: "At least one image is required.",
            validate: {
              notValidFiles: (files) =>
                !isFormSubmissionRequested
                  ? validateFiles(files)
                  : !imgFiles.length
                    ? "At least one image is required."
                    : true,
            },
          })}
          multiple
          hidden
        />
      </div>
      {errors.images && (
        <p className="text-xs font-semibold text-red-500">
          {errors.images?.message}
        </p>
      )}
      {!!returnImgUrls?.length && (
        <ul className="!mb-8 !mt-5 flex flex-wrap gap-x-3 gap-y-5">
          {Array.from(returnImgUrls).map((returnImgUrl, urlIndex) => (
            <li className="relative" key={returnImgUrl + urlIndex}>
              {!!returnImgUrl && (
                <Image
                  src={returnImgUrl}
                  alt={`Image ${urlIndex + 1} as proof`}
                  className="size-20 rounded-md border border-neutral-200 object-cover"
                  height={0}
                  width={0}
                  sizes="240px"
                />
              )}
              <MdCancel
                className="absolute right-0 top-0 size-[22px] -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full bg-white text-red-500 transition-[color] duration-300 ease-in-out hover:text-red-600"
                onClick={() => {
                  setImgFiles((prevImgFiles) =>
                    [...prevImgFiles].filter(
                      (prevFile, prevFileIndex) => prevFileIndex !== urlIndex,
                    ),
                  );

                  setReturnImgUrls((prevImgUrls) =>
                    [...prevImgUrls].filter(
                      (prevImgUrl) => prevImgUrl !== returnImgUrl,
                    ),
                  );
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
