"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useNotifications = () => {

  const axiosPublic = useAxiosPublic();

  const { data: notificationList, isPending: isNotificationPending, refetch } = useQuery({
    queryKey: ["notificationList"],
    queryFn: async () => {
      const res = await axiosPublic.get("/get-merged-notifications");
      return res?.data;
    },
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    onError: (err) => {
      console.error(`Error fetching category:`, err);
    }
  })

  return [notificationList, isNotificationPending, refetch];
};

export default useNotifications;