"use client";
import { useEffect, useState } from "react";
import SetupForm from "@/app/components/layout/SetupForm";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import Loading from "@/app/components/shared/Loading/Loading";
import AccessVerificationFailed from "@/app/components/layout/AccessVerificationFailed";

export default function SetupPage({ searchParams }) {
  const [isValidToken, setIsValidToken] = useState(null); // State to store token validation status
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error message
  const axiosPublic = useAxiosPublic();
  const token = searchParams.token;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setErrorMessage("Token is missing");
        return;
      }

      try {
        const response = await axiosPublic.post("/validate-token", { token });

        if (response.status === 200 && response.data.message === "Access verified successfully.") {
          setIsValidToken(true); // Token is valid
        } else {
          setIsValidToken(false);
          setErrorMessage(response.data.message || "Invalid token");

        }
      } catch (error) {
        setIsValidToken(false);

        // Extract the server's error response message
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Error validating token");
        }
      }
    };

    validateToken();
  }, [token, axiosPublic]);

  if (isValidToken === null) {
    return <Loading /> // Optional: Show loading state until token is validated
  }

  if (!isValidToken) {
    return (
      <AccessVerificationFailed errorMessage={errorMessage} />
    );
  }

  return <SetupForm token={token} isValidToken={isValidToken} />;
}