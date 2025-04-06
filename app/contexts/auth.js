"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useCustomers from "../hooks/useCustomers";

// Create a new context for authentication and user data
const AuthContext = createContext({
  user: null,
  userData: null,
  setUserData: null,
  isUserLoading: false,
});

// A Provider component that provides authentication and user data context to its children.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { data: session, status } = useSession();
  const axiosPublic = useAxiosPublic();
  const [customerList, isCustomerListLoading, customerRefetch] = useCustomers();

  // Listen for changes to the user's authentication state
  // When the token changes, update the states accordingly
  useEffect(() => {
    const updateUserData = async (userEmail) => {
      try {
        const { data } = await axiosPublic.get("/allCustomerDetails");
        const doesUserHaveAccount = data.some(
          (userData) => userData.email === userEmail,
        );

        if (!doesUserHaveAccount) return setUserData(null);

        const res = await axiosPublic.get(
          `/customerDetailsViaEmail/${userEmail}`,
        );

        if (!res?.data) return setUserData(null);

        const currentUserData = res?.data;

        const localWishlist = JSON.parse(localStorage.getItem("wishlistItems"));
        const localCart = JSON.parse(localStorage.getItem("cartItems"));
        const updatedWishlist = !!localWishlist?.length
          ? localWishlist
          : !!currentUserData?.wishlistItems?.length
            ? currentUserData?.wishlistItems
            : [];
        const updatedCartItems = !!localCart?.length
          ? localCart
          : !!currentUserData?.cartItems?.length
            ? currentUserData?.cartItems
            : [];

        localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("storageWishlist"));
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        window.dispatchEvent(new Event("storageCart"));

        const updatedUserData = {
          ...currentUserData,
          wishlistItems: updatedWishlist,
          cartItems: updatedCartItems,
        };

        const response = await axiosPublic.put(
          `/updateUserInformation/${currentUserData?._id}`,
          updatedUserData,
        );

        if (!!response?.data?.modifiedCount || !!response?.data?.matchedCount) {
          setUserData(updatedUserData);
        } else setUserData(null);
      } catch (error) {
        console.log("Failed to sync user data.", error);
      }

      setIsUserLoading(false);
    };

    if (
      status === "loading" ||
      isCustomerListLoading ||
      !customerList?.length
    ) {
      return () => !isUserLoading && setIsUserLoading(true);
    }

    if (status === "unauthenticated") {
      setUser(null);
      setUserData(null);
      setIsUserLoading(false);
    } else {
      setUser(session?.user);
      if (!userData)
        updateUserData(
          session?.user?.email,
          session?.user?.name,
          session?.user?.provider,
        );
      setIsUserLoading(false);
    }
  }, [
    axiosPublic,
    customerList,
    isCustomerListLoading,
    isUserLoading,
    session,
    status,
    userData,
  ]);

  // Provide the user state, loading state, and user data to child components through context
  return (
    <AuthContext.Provider
      value={{ user, userData, setUserData, isUserLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
