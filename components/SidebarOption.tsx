"use client";
import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

function SidebarOption({ id, href }: { id: string; href: string }) {
  const [data, loading, error] = useDocumentData(
    doc(db, "documents", id) // This should match the collection name from createNewDocument
  );

  const pathname = usePathname();
  const isActive = href === pathname; // Simplified the active check

  if (loading)
    return (
      <div className="border p-2 rounded-md border-gray-400">Loading...</div>
    );
  if (error) return null;
  if (!data) return null;

  return (
    <Link
      href={href}
      className={`border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      <p className="truncate">{data.title}</p>
    </Link>
  );
}
export default SidebarOption;
