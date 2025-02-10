import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import OrderCard from "./OrderCard";
import TrackOrderModal from "./TrackOrderModal";
import ReturnOrderModal from "./ReturnOrderModal";

export default function OrderHistory({ orders }) {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeTrackOrder, setActiveTrackOrder] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: "",
      issue: "",
      description: "",
      items: [],
      images: "",
    },
    mode: "onBlur",
  });

  useFieldArray({
    control,
    name: "items",
  });

  return (
    <section className="grow auto-rows-max rounded-xl border-2 border-neutral-50/20 bg-white/60 p-3.5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl xl:p-5 [&_img]:pointer-events-none">
      <h1 className="mb-5 text-lg font-bold uppercase md:text-xl">
        Order History
      </h1>
      <div className="max-xl:space-y-4 xl:grid xl:grid-cols-2 xl:gap-4">
        {orders.map((order) => {
          return (
            <OrderCard
              key={order?._id}
              order={order}
              setValue={setValue}
              setIsTrackModalOpen={setIsTrackModalOpen}
              setActiveTrackOrder={setActiveTrackOrder}
              setIsReturnModalOpen={setIsReturnModalOpen}
              setActiveReturnOrder={setActiveReturnOrder}
            />
          );
        })}
        <TrackOrderModal
          isTrackModalOpen={isTrackModalOpen}
          setIsTrackModalOpen={setIsTrackModalOpen}
          activeTrackOrder={activeTrackOrder}
        />
        <ReturnOrderModal
          isReturnModalOpen={isReturnModalOpen}
          setIsReturnModalOpen={setIsReturnModalOpen}
          activeReturnOrder={activeReturnOrder}
          register={register}
          watch={watch}
          control={control}
          handleSubmit={handleSubmit}
          setValue={setValue}
          reset={reset}
          trigger={trigger}
          errors={errors}
        />
      </div>
    </section>
  );
}
