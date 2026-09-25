import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 1. Read the existing secure authentication cookie.
    const cookieStore = await cookies();
    const authToken = cookieStore.get("cbc_auth_token")?.value;

    if (!authToken) {
      return Response.json(
        {
          authenticated: false,
          success: false,
          message: "No authentication cookie found.",
        },
        { status: 401 }
      );
    }

    // 2. Authenticate with the existing Live PocketBase.
    const pb = new PocketBase(
      "https://christiansbiblecompanion.com/hcgi/platform"
    );

    pb.authStore.save(authToken, null);

    const authData = await pb.collection("users").authRefresh();
    const userId = authData.record.id;

    // 3. Retrieve one existing userProgress record belonging
    //    to the authenticated user.
    const result = await pb.collection("userProgress").getList(1, 1, {
      filter: `userId = "${userId}"`,
      sort: "dayNumber",
      $autoCancel: false,
    });

    if (!result.items.length) {
      return Response.json(
        {
          authenticated: true,
          success: false,
          message: "No userProgress record was found for the authenticated user.",
          userId,
        },
        { status: 404 }
      );
    }

    const record = result.items[0];

    // 4. Capture the existing application data before the write.
    const before = {
      id: record.id,
      userId: record.userId,
      weekNumber: record.weekNumber,
      dayNumber: record.dayNumber,
      morningComplete: record.morningComplete,
      eveningComplete: record.eveningComplete,
      completionDate: record.completionDate,
      calculatedDate: record.calculatedDate,
      streakCount: record.streakCount,
      totalDaysCompleted: record.totalDaysCompleted,
      updated: record.updated,
    };

    // 5. Perform the controlled no-effective-change update.
    //    This is the ONLY application field being sent to PocketBase.
    const updatedRecord = await pb.collection("userProgress").update(
      record.id,
      {
        morningComplete: record.morningComplete,
      },
      {
        $autoCancel: false,
      }
    );

    // 6. Capture the corresponding values after the write.
    const after = {
      id: updatedRecord.id,
      userId: updatedRecord.userId,
      weekNumber: updatedRecord.weekNumber,
      dayNumber: updatedRecord.dayNumber,
      morningComplete: updatedRecord.morningComplete,
      eveningComplete: updatedRecord.eveningComplete,
      completionDate: updatedRecord.completionDate,
      calculatedDate: updatedRecord.calculatedDate,
      streakCount: updatedRecord.streakCount,
      totalDaysCompleted: updatedRecord.totalDaysCompleted,
      updated: updatedRecord.updated,
    };

    // 7. Verify that the intended field retained exactly its
    //    original value and that the other application fields
    //    inspected above did not change.
    const applicationDataUnchanged =
      before.userId === after.userId &&
      before.weekNumber === after.weekNumber &&
      before.dayNumber === after.dayNumber &&
      before.morningComplete === after.morningComplete &&
      before.eveningComplete === after.eveningComplete &&
      before.completionDate === after.completionDate &&
      before.calculatedDate === after.calculatedDate &&
      before.streakCount === after.streakCount &&
      before.totalDaysCompleted === after.totalDaysCompleted;

    return Response.json({
      authenticated: true,
      success: true,
      message: "Authenticated userProgress update succeeded.",
      writeTest: "no-effective-change",
      recordId: record.id,
      userId,
      before,
      after,
      applicationDataUnchanged,
      systemUpdatedTimestampChanged: before.updated !== after.updated,
    });
  } catch (error) {
    return Response.json(
      {
        authenticated: false,
        success: false,
        error: error?.message || "userProgress write test failed.",
        response: error?.response || null,
      },
      { status: 500 }
    );
  }
}
