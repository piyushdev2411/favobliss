export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#ef911f] to-[#d97d0f] text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto mt-4 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}