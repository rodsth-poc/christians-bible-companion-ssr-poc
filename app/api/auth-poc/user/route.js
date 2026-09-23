import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("cbc_auth_token")?.value;

    if (!authToken) {
      return Response.json(
        {
          authenticated: false,
          message: "No authentication cookie found.",
        },
        { status: 401 }
      );
    }

    const pb = new PocketBase(
      "https://christiansbiblecompanion.com/hcgi/platform"
    );

    pb.authStore.save(authToken, null);

    const authData = await pb.collection("users").authRefresh();

    return Response.json({
      authenticated: true,
      user: {
        id: authData.record.id,
        email: authData.record.email,
      },
    });
  } catch (error) {
    return Response.json(
      {
        authenticated: false,
        error: error?.message || "Authentication failed.",
        response: error?.response || null,
      },
      { status: 500 }
    );
  }
}
