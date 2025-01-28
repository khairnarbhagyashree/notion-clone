"use server";

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { useId } from "react";

export async function createNewDocument() {
  const session = await auth();

  if (!session || !session.sessionClaims?.email) {
    throw new Error("Unauthorized");
  }

  const { sessionClaims } = session;
  const docCollectionref = adminDb.collection("documents");
  const docRef = await docCollectionref.add({
    title: "New Doc",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });
  return { docId: docRef.id };
}
