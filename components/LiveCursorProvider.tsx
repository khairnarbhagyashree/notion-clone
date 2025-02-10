"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
  const [myPresense, updateMyPresense] = useMyPresence();
  const others = useOthers();

  function handlePointerMove(e: PointerEvent) {
    const cursor = {
      x: Math.floor(e.pageX),
      y: Math.floor(e.pageY),
    };
    updateMyPresense({ cursor });
  }

  function handlePointerLeave() {
    updateMyPresense({ cursor: null });
  }

  return (
    <div
      onPointerMove={(e) => handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {others
        .filter((other) => other.presence?.cursor !== null)
        .map((other) => (
          <FollowPointer
            key={other.connectionId}
            info={other.info}
            x={other.presence.cursor!.x}
            y={other.presence.cursor!.y}
          />
        ))}
      {/* render the cursor */}
      {children}
    </div>
  );
}
export default LiveCursorProvider;
