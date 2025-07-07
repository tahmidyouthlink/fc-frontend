import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { authOptions } from "@/app/utils/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.name) {
      console.error(
        "UnauthorizedError (api/upload-files): Session unavailable.",
      );
      return NextResponse.json(
        { message: "Unauthorized: Session unavailable." },
        { status: 401 },
      );
    }

    const formData = await req.formData();

    const result = await tokenizedFetch("/upload-multiple-files", {
      method: "POST",
      body: formData,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("UploadError (api/upload-files):", error.message || error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
