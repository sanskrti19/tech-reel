export default function ActionButtons({fact}){

return(

  <div className="flex gap-2 mt-4">
  <a
    href={fact.readMore}
    target="_blank"
    rel="noopener noreferrer"
    className="
      bg-white
      text-black
      text-xs
      px-3
      py-1.5
      rounded-full
      hover:scale-95
      transition
    "
  >
    Read Docs
  </a>

  <button
    className="
      bg-white/20
      text-white
      text-xs
      px-3
      py-1.5
      rounded-full
      backdrop-blur-md
      hover:bg-white/30
      hover:scale-95
      transition
    "
  >
    Save
  </button>
</div>

)

}