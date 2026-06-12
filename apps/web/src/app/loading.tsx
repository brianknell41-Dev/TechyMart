export default function Loading() {
  return (
    <div className="container-main py-12">
      <div className="skeleton mb-8 h-10 w-64 rounded-xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
