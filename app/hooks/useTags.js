"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useTags = () => {

  const axiosPublic = useAxiosPublic();

  const { data: tagList, isPending: isTagPending, refetch } = useQuery({
    queryKey: ["tagList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allTags");
      return res?.data;
    }
  })

  return [tagList, isTagPending, refetch];
};

export default useTags;