import { adminDb } from "@/firebase-admin";
import liveBlocks, { liveblocks } from "@/lib/liveBlocks";
import { auth } from "@clerk/nextjs/server";
import { exists } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { sessionClaims } = await req.json();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });

  const usersInRoom = await adminDb
    .collection("rooms")
    .where("userId", "==", sessionClaims?.email!)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  const token = await session.authenticate();
  return NextResponse.json({ token });

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json({ error: "User not in room" }, { status: 400 });
  }
}
