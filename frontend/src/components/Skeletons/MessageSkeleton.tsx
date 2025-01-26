const MessageSkeleton = () => {
    const isEven = (num: number) => num % 2 === 0;
  return Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse ${isEven(i) && "flex-row-reverse"}`}
    >
      <div className="h-12 w-12 rounded-full bg-zinc-800" />
      <div className={`${!isEven(i) && "flex-1"} lg:block hidden`}>
        <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-32 bg-zinc-800 rounded" />
      </div>
    </div>
  ));
}

export default MessageSkeleton