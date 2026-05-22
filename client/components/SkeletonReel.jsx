export default function SkeletonReel() {
  return (
    <div className="
      h-screen
      bg-[#050816]
      animate-pulse
      p-4
      flex flex-col
      justify-between
    ">

      <div className="space-y-8">

        <div className="
          h-12
          w-40
          rounded-full
          bg-white/10
        " />

        <div className="space-y-3 mt-20">

          <div className="h-16 w-72 rounded-3xl bg-white/10" />
          <div className="h-16 w-60 rounded-3xl bg-white/10" />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mb-28">

        <div className="h-40 rounded-[32px] bg-white/10" />
        <div className="h-40 rounded-[32px] bg-white/10" />
        <div className="h-40 rounded-[32px] bg-white/10" />
        <div className="h-40 rounded-[32px] bg-white/10" />

      </div>

    </div>
  )
}