import PocketBase from "pocketbase";

const POCKETBASE_URL =
  "https://christiansbiblecompanion.com/hcgi/platform";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim();

    if (!email) {
      return Response.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const pb = new PocketBase(POCKETBASE_URL);

    const result = await pb.collection("users").requestOTP(email);

    return Response.json({
      message: "OTP request submitted successfully.",
      otpId: result.otpId,
    });
  } catch (error) {
    console.error("PocketBase OTP request failed:", error);

    return Response.json(
      { error: "Unable to request OTP." },
      { status: 500 }
    );
  }
}
