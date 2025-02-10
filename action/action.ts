"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveBlocks";
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

export async function deleteDocument(roomId: string) {
  auth().protect();
  console.log("deleteDocument", roomId);
  try {
    // delete document from documents collection itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();
    // delete the room reference from the users collection for all users in the room

    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect();
  console.log("inviteUserToDocument", roomId, email);

  try {
    await adminDb.collection("users").doc(email).collection("rooms").set({
      userId: email,
      role: "editor",
      createdAt: new Date(),
      roomId,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserfromDocument(roomId: string, email: string) {
  auth().protect();
  console.log("removeUserfromDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
