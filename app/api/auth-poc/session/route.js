import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function GET(request) {
  try {
    const authToken = request.cookies.get("cbc_auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "No authentication cookie was found.",
        },
        { status: 401 }
      );
    }

    const pb = new PocketBase(
      "https://christiansbiblecompanion.com/hcgi/platform"
    );

    pb.authStore.save(authToken, null);

    const authData = await pb.collection("users").authRefresh();

    return NextResponse.json({
      authenticated: true,
      userId: authData.record.id,
      email: authData.record.email,
    });
  } catch (error) {
    console.error("Session verification error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        message: error?.message || "Session verification failed.",
      },
      { status: 401 }
    );
  }
}
