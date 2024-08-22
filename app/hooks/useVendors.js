"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useVendors = () => {

  const axiosPublic = useAxiosPublic();

  const { data: vendorList, isPending: isVendorPending } = useQuery({
    queryKey: ["vendorList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allVendors");
      return res?.data;
    }
  })

  return [vendorList, isVendorPending];
};

export default useVendors;