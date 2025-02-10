import { PiChatText } from "react-icons/pi";

export default function ChatButton() {
  return (
    <button className="fixed right-3 top-1/2 z-[3] -translate-y-1/2 space-y-4 rounded-md bg-[#ced0fb] p-2.5 text-neutral-700 opacity-60 transition-[background-color,opacity] hover:bg-[#b3b3f1] hover:text-neutral-900 hover:opacity-100 lg:right-5">
      <PiChatText className="size-6 transition-[color] duration-300 ease-in-out" />
    </button>
  );
}
