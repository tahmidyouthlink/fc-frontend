"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useColors = () => {

  const axiosPublic = useAxiosPublic();

  const { data: colorList, isPending: isColorPending } = useQuery({
    queryKey: ["colorList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allColors");
      return res?.data;
    }
  })

  return [colorList, isColorPending];
};

export default useColors;