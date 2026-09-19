import PocketBase from "pocketbase";

const POCKETBASE_URL =
  "https://christiansbiblecompanion.com/hcgi/platform";

export async function POST(request) {
  try {
    const body = await request.json();

    const otpId = body?.otpId?.trim();
    const otpCode = body?.otpCode?.trim();

    if (!otpId) {
      return Response.json(
        { error: "OTP ID is required." },
        { status: 400 }
      );
    }

    if (!otpCode) {
      return Response.json(
        { error: "OTP code is required." },
        { status: 400 }
      );
    }

    const pb = new PocketBase(POCKETBASE_URL);

    await pb.collection("users").authWithOTP(otpId, otpCode);

    return Response.json({
      message: "OTP verification successful.",
    });
  } catch (error) {
    console.error("PocketBase OTP verification failed:", error);

    return Response.json(
      { error: "Unable to verify OTP." },
      { status: 500 }
    );
  }
}
