"use client";

import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  roomId: string;
  userId: string;
  role: "owner" | "editor";
}

function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );
  console.log("fetched data", user?.emailAddresses[0].toString(), data);
  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({ id: curr.id, ...roomData });
        } else {
          acc.editor.push({ id: curr.id, ...roomData });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );

    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex py-4 flex-col space-y-2 md:max-w-36">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-sm text-gray-500 font-semibold ">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-sm text-gray-500 font-semibold ">
              My documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
      </div>
      {/* Share with me */}
      {groupedData.editor.length > 0 && (
        <>
          <div className="flex py-4 flex-col space-y-2 md:max-w-36">
            <h2 className="text-sm text-gray-500 font-semibold ">
              Shared with me
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </div>
        </>
      )}
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
export default Sidebar;
