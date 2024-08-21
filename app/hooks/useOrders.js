"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useOrders = () => {

  const axiosPublic = useAxiosPublic();

  const { data: orderList, isPending: isOrderPending, refetch } = useQuery({
    queryKey: ["orderList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allOrders");
      return res?.data;
    }
  })

  return [orderList, isOrderPending, refetch];
};

export default useOrders;