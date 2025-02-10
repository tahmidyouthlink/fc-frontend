"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getIdToken, onIdTokenChanged } from "firebase/auth";
import { auth } from "@/firebase.config";
import { createSession, removeSession } from "../actions/auth";
import useAxiosPublic from "../hooks/useAxiosPublic";

// Create a new context for authentication
const AuthContext = createContext({
  user: null,
  userData: null,
  setUserData: null,
  isUserLoading: false,
});

// A Provider component that provides authentication context to its children.
export const AuthProvider = ({ children }) => {
  // State hooks to hold the authenticated user and loading status
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // Listen for changes to the user's authentication state
  // When the token changes, update the states and token cookie accordingly
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

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        await removeSession();
        setUserData(null);
        setIsUserLoading(false);
      } else {
        const token = await getIdToken(user, true);
        setUser(user);
        await createSession(token);
        if (!userData) updateUserData(user?.email);
        setIsUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic, userData]);

  // Provide the user state and loading state to child components through context
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
