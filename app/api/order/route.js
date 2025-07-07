import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { authOptions } from "@/app/utils/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.name) {
      console.error("UnauthorizedError (api/order): Session unavailable.");
      return NextResponse.json(
        { message: "Unauthorized: Session unavailable." },
        { status: 401 },
      );
    }

    const body = await req.json();

    const result = await tokenizedFetch("/addOrder", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("UploadError (api/order):", error.message || error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
