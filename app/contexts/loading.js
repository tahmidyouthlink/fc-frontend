import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LoadingContext = createContext({
  isPageLoading: false,
  setIsPageLoading: null,
});

export const LoadingProvider = ({ children }) => {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const [isPending, startTransition] = useTransition();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // useEffect(() => {
  //   startTransition(() => {
  //     setIsPageLoading(false);
  //   });
  //   console.log("load ctx INSIDE");

  //   return () => {
  //     startTransition(() => {
  //       setIsPageLoading(true);
  //     });
  //     console.log("load ctx RETURN");
  //   };
  // }, [pathname, searchParams]);

  // useEffect(() => {
  //   // Add event listeners to route changes and update the loading state accordingly
  //   router.events.on("routeChangeStart", () => setIsPageLoading(true));
  //   router.events.on("routeChangeComplete", () => setIsPageLoading(false));

  //   // Clean up the event listeners when the component is unmounted
  //   return () => {
  //     router.events.off("routeChangeStart", () => setIsPageLoading(true));
  //     router.events.off("routeChangeComplete", () => setIsPageLoading(false));
  //   };
  // }, []);

  return (
    <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};