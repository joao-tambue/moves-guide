export default function ActorSkeleton() {
  return (
    <div className="relative mt-6 w-full rounded-2xl shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] overflow-hidden animate-pulse">
      <div className="relative w-full h-[300px] rounded-2xl bg-gray-700" />
      <div className="py-4 px-2 text-center">
        <div className="h-5 bg-gray-600 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}