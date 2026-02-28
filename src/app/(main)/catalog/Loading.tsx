import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full">
      <section className="w-full h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6">
        <Skeleton className="h-12 w-[300px] mb-6 bg-white/10" />
        <Skeleton className="h-6 w-[80%] max-w-[600px] bg-white/5" />
        <Skeleton className="h-6 w-[60%] max-w-[400px] mt-2 bg-white/5" />
      </section>

      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-xl bg-gray-100/5" />
        ))}
      </div>
    </div>
  );
}
