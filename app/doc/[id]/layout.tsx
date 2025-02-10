import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { userId } = await auth();
  const { id: paramsId } = await params;
  if (!userId) {
    redirect("/sign-in");
  }
  return <RoomProvider roomId={paramsId}>{children}</RoomProvider>;
}
export default DocLayout;
