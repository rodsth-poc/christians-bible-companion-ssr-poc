import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(request) {
  try {
    const body = await request.json();

    const otpId = body?.otpId;
    const otpCode = body?.otpCode;

    if (!otpId || !otpCode) {
      return NextResponse.json(
        { message: "OTP ID and OTP code are required." },
        { status: 400 }
      );
    }

    const pb = new PocketBase(
      "https://christiansbiblecompanion.com/hcgi/platform"
    );

    await pb.collection("users").authWithOTP(otpId, otpCode);

    const authToken = pb.authStore.token;

    if (!authToken) {
      return NextResponse.json(
        { message: "OTP verification succeeded, but no authentication token was returned." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      message: "OTP verification successful.",
    });

    response.cookies.set("cbc_auth_token", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      {
        message:
          error?.message || "OTP verification failed.",
      },
      { status: 500 }
    );
  }
}
