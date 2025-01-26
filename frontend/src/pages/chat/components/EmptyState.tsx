import { Logo } from "@/assets/Logo";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <Logo classname=" h-14 w-14 animate-bounce" />
      <div className="text-center">
        <h3 className="text-zinc-300 text-lg font-medium mb-1">
          No conversation selected
        </h3>
        <p className="text-zinc-500 text-sm">
          Choose a friend to start chatting
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
