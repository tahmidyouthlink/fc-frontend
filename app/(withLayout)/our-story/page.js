import { rawFetch } from "@/app/lib/fetcher/rawFetch";
import StoryContents from "@/app/components/story/StoryContents";

export default async function OurStory() {
  let departments;

  try {
    const result = await rawFetch("/get-all-story-collection-frontend");

    departments = result.data || [];
  } catch (error) {
    console.error("FetchError (story):", error.message);
  }

  if (!departments?.length) return null;

  return <StoryContents departments={departments} />;
}
