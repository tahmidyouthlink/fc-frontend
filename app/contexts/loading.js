"use client";

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext({
  isPageLoading: false,
  setIsPageLoading: null,
});

export const LoadingProvider = ({ children }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
