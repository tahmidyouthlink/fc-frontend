"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useVendors = () => {

  const axiosPublic = useAxiosPublic();

  const { data: vendorList, isPending: isVendorPending, refetch } = useQuery({
    queryKey: ["vendorList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allVendors");
      return res?.data;
    }
  })

  return [vendorList, isVendorPending, refetch];
};

export default useVendors;