import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { tokenizedFetch } from "@/app/lib/fetcher/tokenizedFetch";
import { authOptions } from "@/app/utils/authOptions";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session?.user?.name) {
      console.error("UnauthorizedError (api/userData): Session unavailable.");
      return NextResponse.json(
        { message: "Unauthorized: Session unavailable." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();

    const result = await tokenizedFetch(`/updateUserInformation/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("UploadError (api/userData):", error.message || error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
