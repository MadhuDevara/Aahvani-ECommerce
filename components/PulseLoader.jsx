export default function PulseLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500/50" />
        <span className="absolute inline-flex h-10 w-10 rounded-full bg-orange-500/30" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-orange-500" />
      </div>
      <p className="text-[0.65rem] font-semibold tracking-[0.24em] uppercase text-orange-500">
        Aahavani
      </p>
    </div>
  )
}
