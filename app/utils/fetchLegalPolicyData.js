import axios from "axios";

export const fetchLegalPolicyData = async (policyEndpoint) => {
  const response = await axios.get(
    `https://fashion-commerce-backend.vercel.app/${policyEndpoint}`,
  );
  const [legalPolicyData] = response.data || [];

  return legalPolicyData;
};
