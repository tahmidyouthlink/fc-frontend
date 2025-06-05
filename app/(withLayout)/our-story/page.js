import axios from "axios";
import StoryContents from "@/app/components/story/StoryContents";

export const dynamic = "force-dynamic";

export default async function OurStory() {
  let departments = null;

  try {
    const response = await axios.get(
      "https://fc-backend-664306765395.asia-south1.run.app/get-all-story-collection-backend",
    );
    departments =
      response.data?.filter((department) => department.status === true) || [];
  } catch (error) {
    console.error(
      "Failed to fetch story contents:",
      error.response?.data?.message || error.response?.data || error,
    );
  }

  if (!departments?.length) return null;

  return <StoryContents departments={departments} />;
}
