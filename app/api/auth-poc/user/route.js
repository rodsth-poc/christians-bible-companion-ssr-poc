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
    const userId = authData.record.id;

    const result = await pb.collection("userProgress").getList(1, 1, {
      filter: `userId = "${userId}"`,
      sort: "dayNumber",
      $autoCancel: false,
    });

    return Response.json({
      authenticated: true,
      user: {
        id: userId,
        email: authData.record.email,
      },
      userProgress: {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items,
      },
    });
  } catch (error) {
    return Response.json(
      {
        authenticated: false,
        error: error?.message || "userProgress read failed.",
        response: error?.response || null,
      },
      { status: 500 }
    );
  }
}
