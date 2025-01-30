import { Liveblocks } from "@liveblocks/client";
const key = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;
if (!key) {
  throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set");
}
export const liveblocks = new Liveblocks({
  secretKey: key,
});

export default liveblocks;
