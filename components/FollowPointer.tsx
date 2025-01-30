import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";
function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: { name: string; email: string; avatar: string };
}) {
  const color = stringToColor(info.email || "1");

  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{ top: y, left: x, pointerEvents: "none" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <svg
        stroke={color}
        fill={color}
        strokeWidth="1"
        viewBox="0 0 16 16"
        className={`h-6 w-6 text-[${color}] transform -rotate-[70deg] - translate-x-[12px] -translate-y-[10px] stroke-[${color}]`}
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 14.5c1 1 1 1.5 0 2.5l-11-11c-1-1-1.5-1-2.5 0l-5 5c-1 1-1 1.5 0 2.5l11 11c1 1 1.5 1 2.5 0z"></path>
      </svg>
      <motion.div
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-sm rounded-full"
      >
        {info.name || info.email}
      </motion.div>
    </motion.div>
  );
}
export default FollowPointer;
