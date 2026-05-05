import PulseLoader from "@/components/PulseLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <PulseLoader />
    </div>
  );
}
