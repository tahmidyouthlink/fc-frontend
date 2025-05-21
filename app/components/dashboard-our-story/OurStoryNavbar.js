"use client";
import dynamic from 'next/dynamic';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import Image from 'next/image';
import toast from 'react-hot-toast';
import FileUploadZone from './FileUploadZone';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import useAxiosPublic from '@/app/hooks/useAxiosPublic';
const OurStoryEditor = dynamic(() => import('@/app/utils/Editor/OurStoryEditor'), { ssr: false });
import DOMPurify from "dompurify";

const OurStoryNavbar = () => {

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      items: [{ quote: "", hashtag: "" }],
    },
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const axiosPublic = useAxiosPublic();
  const [sizeError1, setSizeError1] = useState("");
  const [sizeError2, setSizeError2] = useState("");
  const [coverImgUrl, setCoverImgUrl] = useState(null);
  const [staffImgUrl, setStaffImgUrl] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]); // to store uploaded media URLs
  const handleRemoveCoverImage = () => setCoverImgUrl(null);
  const handleRemoveStaffImage = () => setStaffImgUrl(null);
  const handleRemoveMedia = (indexToRemove) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  const [requiredFileErrors, setRequiredFileErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleCancel = () => {
    reset();
    setSizeError1("");
    setSizeError2("");
    setRequiredFileErrors([]);
    setCoverImgUrl(null);
    setStaffImgUrl(null);
    setMediaUrls([]);
    onClose();
  };

  const uploadSingleFileToGCS = async (file) => {
    try {
      const formData = new FormData();
      formData.append('attachment', file);

      const response = await axiosPublic.post('/upload-single-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response?.data?.fileUrl) {
        return response.data.fileUrl;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCoverImgChange = async (file) => {
    if (!file) return; // guard

    setIsUploading(true); // Start Uploading
    if (file) setSizeError1(''); // ✅ clear error once file is selected

    const url = await uploadSingleFileToGCS(file);
    if (url) setCoverImgUrl(url); // store uploaded URL in state
    setIsUploading(false); // Upload finished
  };

  const handleStaffImgChange = async (file) => {
    if (!file) return;

    setIsUploading(true); // Start Uploading
    if (file) setSizeError2(''); // ✅ clear error once file is selected

    const url = await uploadSingleFileToGCS(file);
    if (url) setStaffImgUrl(url);
    setIsUploading(false); // Upload finished
  };

  const handleMediaSelect = async (index, file) => {
    if (!file) return;

    setIsUploading(true); // Start upload

    // Local preview using URL.createObjectURL
    const tempUrl = URL.createObjectURL(file);

    // Update preview immediately
    const updatedUrls = [...mediaUrls];
    updatedUrls[index] = tempUrl;
    setMediaUrls(updatedUrls);

    // Clear error
    const updatedErrors = [...requiredFileErrors];
    updatedErrors[index] = '';
    setRequiredFileErrors(updatedErrors);

    // Upload and replace preview with real URL
    const uploadedUrl = await uploadSingleFileToGCS(file);
    if (uploadedUrl) {
      updatedUrls[index] = uploadedUrl;
      setMediaUrls([...updatedUrls]);
    }

    setIsUploading(false); // Upload finished
  };

  const onSubmit = async (data) => {
    setIsLoading(true); // Start loading

    if (isUploading) {
      toast.error('Please wait until all uploads are complete.');
      return;
    };

    try {

      let hasError = false;

      if (!coverImgUrl) {
        setSizeError1("Cover image is required.");
        hasError = true;
      }

      if (!staffImgUrl) {
        setSizeError2("Staff image is required.");
        hasError = true;
      }

      let errors = [];

      if (!fields.length || !mediaUrls || mediaUrls.length === 0) {
        hasError = true;
        errors = fields.map(() => "This media upload is required.");
      } else {
        errors = fields.map((_, index) => {
          const file = mediaUrls[index];
          if (!file) {
            hasError = true;
            return "This media upload is required.";
          }
          return "";
        });
      }
      setRequiredFileErrors(errors);

      if (hasError) return;

      // Merge and proceed
      const mergedStoryInformation = data.items.map((item, index) => ({
        ...item,
        mediaSrc: mediaUrls[index] || null,
      }));

      const storyInformation = {
        departmentName: data.departmentName,
        coverImgUrl,
        workSummary: data.workSummary,
        staff: {
          staffName: data.staffName,
          staffImgUrl
        },
        contents: mergedStoryInformation
      };

      console.log(storyInformation, "storyInformation");

      // const response = await axiosPublic.post('/add-our-story-information', storyInformation);

      if (response.data.success) {

        // ✅ Show success toast if the invitation is successfully sent
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCheck className="h-6 w-6 bg-green-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Invitation Sent Successfully!
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {response?.data?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });

      } else {

        // ⚠️ Handle the case where email sending failed but user data was inserted
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex items-center ring-1 ring-black ring-opacity-5`}
          >
            <div className="pl-6">
              <RxCross2 className="h-6 w-6 bg-yellow-500 text-white rounded-full" />
            </div>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-gray-900">
                    Email Sending Failed
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The user was added, but the invitation email could not be sent.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center font-medium text-red-500 hover:text-red-700 focus:outline-none text-2xl"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right",
          duration: 5000
        });
      }


    } catch (err) {
      toast.error("Failed to publish your work");
    } finally {
      setIsLoading(false); // End loading regardless of success/failure
    }
  };

  return (
    <>
      <div className='flex justify-between items-center sticky top-0 z-10'>
        <h1 className="font-bold text-lg md:text-xl lg:text-3xl text-neutral-700 py-1 2xl:py-3">OUR STORY</h1>
        <h1>Hi</h1>
        <button onClick={() => onOpen()} className="relative z-[1] flex items-center gap-x-3 rounded-lg bg-[#ffddc2] px-[15px] py-2.5 transition-[background-color] duration-300 ease-in-out hover:bg-[#fbcfb0] font-bold text-[14px] text-neutral-700">
          <FaPlus size={15} className='text-neutral-700' /> Add
        </button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {() => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="bg-gray-200">
                <h2 className="text-lg font-semibold px-2">Add Story</h2>
              </ModalHeader>
              <ModalBody className="modal-body-scroll">
                <div className="space-y-4 p-1">

                  {/* <div className='flex flex-col gap-2'>
                    <label htmlFor='heading' className='font-semibold text-[#9F5216] text-sm'>Heading <span className='text-red-600'>*</span></label>
                    <Controller
                      name="heading"
                      defaultValue=""
                      control={control}
                      render={({ field }) => <OurStoryEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />}
                    />
                    {errors.heading?.type === "required" && (
                      <p className="text-red-600 text-left pt-1 text-xs">Heading is required</ p>
                    )}
                  </div>

                  <div className='flex flex-col gap-2 font-semibold'>
                    <label htmlFor='subHeading' className='font-semibold text-[#9F5216] text-sm'>Sub Heading <span className='text-red-600'>*</span></label>
                    <input id='subHeading' {...register("subHeading", { required: true })} className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]" placeholder='Enter Sub Heading' type="text" />
                    {errors.subHeading?.type === "required" && (
                      <p className="text-red-600 text-left text-xs">Sub Heading is required</p>
                    )}
                  </div> */}

                  <div className='flex flex-col gap-2 font-semibold'>
                    <label htmlFor='departmentName' className='font-semibold text-[#9F5216] text-sm'>Department Name <span className='text-red-600'>*</span></label>
                    <input id='departmentName' {...register("departmentName", { required: true })} className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]" placeholder='Enter Department Name' type="text" />
                    {errors.departmentName?.type === "required" && (
                      <p className="text-red-600 text-left text-xs">Department Name is required</p>
                    )}
                  </div>

                  <div className='flex flex-col gap-3'>
                    <label className='font-semibold text-[#9F5216]' htmlFor="description">Upload Cover Image <span className='text-red-600'>*</span></label>
                    <FileUploadZone
                      inputId="image-upload-1"
                      description="Maximum file size is 10 MB"
                      accept={['image/png', 'image/jpeg', 'image/jpg']}
                      onFileSelect={handleCoverImgChange}
                      requiredError={sizeError1}
                      validateFile={(file) => {
                        if (!file.type.startsWith("image/")) {
                          return "Only image files are allowed in this field.";
                        }
                        return null; // no error
                      }}
                      previewUrl={coverImgUrl}
                      onRemove={handleRemoveCoverImage}
                      isUploading={isUploading}
                    />
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label htmlFor='workSummary' className='font-semibold text-[#9F5216] text-sm'>Work Summary <span className='text-red-600'>*</span></label>
                    <Controller
                      name="workSummary"
                      defaultValue=""
                      rules={{
                        required: "Work summary must be at least 10 characters.",
                        validate: (value) => {
                          const strippedText = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();
                          if (!strippedText) return "Work summary is required.";
                          if (strippedText.length < 10) return "Work summary must be at least 10 characters.";
                          return true;
                        },
                      }}
                      control={control}
                      render={({ field }) => <OurStoryEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />}
                    />
                    {errors.workSummary && (
                      <p className="text-red-600 text-left pt-1 text-xs font-semibold">
                        {errors.workSummary.message}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-col gap-2 font-semibold'>
                    <label htmlFor='staffName' className='font-semibold text-[#9F5216] text-sm'>Staff Name <span className='text-red-600'>*</span></label>
                    <input id='staffName' {...register("staffName", { required: true })} className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]" placeholder='Enter Staff Name' type="text" />
                    {errors.staffName?.type === "required" && (
                      <p className="text-red-600 text-left text-xs">Staff Name is required</p>
                    )}
                  </div>

                  <div className='flex flex-col gap-3'>
                    <label className='font-semibold text-[#9F5216]' htmlFor="description">Upload Staff Image <span className='text-red-600'>*</span></label>
                    <FileUploadZone
                      inputId="image-upload-2"
                      description="Maximum file size is 10 MB"
                      accept={['image/png', 'image/jpeg', 'image/jpg']}
                      onFileSelect={handleStaffImgChange}
                      requiredError={sizeError2}
                      validateFile={(file) => {
                        if (!file.type.startsWith("image/")) {
                          return "Only image files are allowed in this field.";
                        }
                        return null; // no error
                      }}
                      previewUrl={staffImgUrl}
                      onRemove={handleRemoveStaffImage}
                      isUploading={isUploading}
                    />
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="relative border p-4 rounded-lg shadow-sm space-y-4">

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            remove(index);
                            setMediaUrls(prev => prev.filter((_, i) => i !== index)); // remove media URL at index
                          }}
                          className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}

                      {/* Upload Media Content */}
                      <div className="flex flex-col gap-3">
                        <label htmlFor={`media-upload-${index}`} className="font-semibold text-[#9F5216]">
                          Upload Media Content <span className="text-red-600">*</span>
                        </label>
                        <FileUploadZone
                          inputId={`media-upload-${index}`}
                          description="Maximum file size is 100 MB"
                          accept={['image/png', 'image/jpeg', 'image/jpg', 'video/mp4']}
                          onFileSelect={(file) => handleMediaSelect(index, file)}
                          requiredError={requiredFileErrors[index]}
                          previewUrl={[mediaUrls[index]]}
                          onRemove={() => handleRemoveMedia(index)}
                          isUploading={isUploading}
                        />
                      </div>

                      {/* Hashtag Input */}
                      <div className="flex flex-col gap-2 font-semibold">
                        <label htmlFor={`items.${index}.hashtag`} className="font-semibold text-[#9F5216] text-sm">
                          Hashtag *
                        </label>
                        <input
                          id={`items.${index}.hashtag`}
                          {...register(`items.${index}.hashtag`, { required: true })}
                          className="h-11 w-full rounded-lg border-2 border-[#ededed] px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#F4D3BA] focus:bg-white md:text-[13px]"
                          placeholder="Enter Hashtag"
                          type="text"
                        />
                        {errors?.items?.[index]?.hashtag?.type === 'required' && (
                          <p className="text-red-600 text-left pt-1 text-xs font-semibold">Hashtag is required</p>
                        )}
                      </div>

                      {/* Quote Input */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor={`items.${index}.quote`} className="font-semibold text-[#9F5216] text-sm">
                          Quote *
                        </label>
                        <Controller
                          name={`items.${index}.quote`}
                          control={control}
                          defaultValue=""
                          rules={{
                            validate: (value) => {
                              const strippedText = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();
                              if (!strippedText) return "Quote is required.";
                              if (strippedText.length < 10) return "Quote must be at least 10 characters.";
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <OurStoryEditor
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                        {errors?.items?.[index]?.quote && (
                          <p className="text-red-600 text-left pt-1 text-xs font-semibold">
                            {errors.items[index].quote.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                </div>

              </ModalBody>

              <ModalFooter className='flex justify-between items-center border'>
                <button type='button'
                  onClick={() => {
                    append({ quote: "", hashtag: "" });
                    setMediaUrls(prev => [...prev, null]);
                  }}
                  className="w-fit rounded-lg bg-[#0c76df] px-3 py-2 text-xs font-semibold text-white transition-[background-color] duration-300 hover:bg-[#0C67DF] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
                >
                  <FaPlus /> Add Media Content
                </button>
                <div className='flex gap-4 items-center'>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-fit rounded-lg border border-[#0C67DF] px-3 py-1.5 text-xs font-semibold text-[#0C67DF] transition-[background-color] duration-300 hover:bg-blue-50 md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
                  >
                    Close
                  </button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={isUploading}
                    className="w-fit rounded-lg bg-[#0c76df] text-xs font-semibold text-white transition-[background-color] duration-300 hover:bg-[#0C67DF] md:text-sm relative z-[1] flex items-center justify-center gap-x-3 ease-in-out"
                  >
                    {isLoading ? 'Uploading...' : 'Upload'}
                  </Button>

                </div>
              </ModalFooter>

            </form>
          )}
        </ModalContent>
      </Modal>

    </>
  );
};

export default OurStoryNavbar;