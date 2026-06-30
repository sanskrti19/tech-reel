"use client" 

import {Search, Home,Bookmark,Grid2x2,Clock3,CirclePlus,User,X,Sparkles,LoaderCircle} from "lucide-react"
import { useRouter } from "next/navigation"

import { useEffect, useState, useRef } from "react"

 export default function ReelCard({
  fact,
  markViewed,
  isSaved = false,
  onToggleSave,
  onOpenSearch,
  onOpenSaved,
  onOpenHistory,
  onGridMenu,
  showFooterActions = true
}) {
  const cardRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    let timerId = null

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          if (!timerId) {
            timerId = setTimeout(() => {
              if (markViewed) {
                markViewed(fact)
              }
            }, 2000)
          }
        } else {
          if (timerId) {
            clearTimeout(timerId)
            timerId = null
          }
        }
      },
      {
        threshold: 0.7,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [fact._id, markViewed])
 
  const [showAuth, setShowAuth] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
const [user, setUser] = useState(null)
const [summary, setSummary] = useState("");
const [showSummary, setShowSummary] = useState(false);
const [loadingSummary, setLoadingSummary] = useState(false);
 

   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [showModal, setShowModal] = useState(false)
 

 

  useEffect(() => {

  const storedUser =
    JSON.parse(localStorage.getItem("user"))

  if (storedUser) {
    setUser(storedUser)
  }

}, [])

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"))
      } catch {
        setUser(null)
      }
    }

    window.addEventListener("techreel-auth-changed", syncUser)
    return () => window.removeEventListener("techreel-auth-changed", syncUser)
  }, [])

 const handleSummarize = async () => {
  try {
    setLoadingSummary(true);

    const res = await fetch(
      `http://localhost:5000/api/ai/summarize/${fact._id}`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (data?.summary) {
      setSummary(data.summary);
      setShowSummary(true);
    }

  } catch (err) {
    console.log(err);
  } finally {
    setLoadingSummary(false);
  }
};

  const themes = [
    {
      overlay: "from-cyan-500/20",
      glow: "shadow-cyan-500/20"
    },
    {
      overlay: "from-fuchsia-500/20",
      glow: "shadow-fuchsia-500/20"
    },
    {
      overlay: "from-emerald-500/20",
      glow: "shadow-emerald-500/20"
    }
  ]
 
const fullDescription =
  fact.description || "No description available.";

const cardPreview =
  fullDescription.slice(0, 100);

const articleUrl =
  fact.url || "#";

useEffect(() => {
  setSummary("")
  setShowSummary(false)
}, [fact._id])

  const theme =
    themes[fact.title?.length % themes.length]

  const toggleSave = () => {
  const token = localStorage.getItem("token");

   if (!token) {
  setShowAuth(true);
  return;
  }

  
  if (onToggleSave) {
    onToggleSave(fact)
  }
};

  // TODO: Wire top-right grid menu actions in a future Explore release.
  const handleGridMenu = () => {
    if (onGridMenu) {
      onGridMenu()
      return
    }
    router.push("/analytics")
  }

  useEffect(() => {
    if (!showModal && !showAuth) return

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false)
        setShowAuth(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [showModal, showAuth])

  const requireAuth = (callback) => {

  if (!user) {
    setShowAuth(true)
    return
  }

  callback()
}

  const creator = fact.creator;
  const creatorLabel = creator?.name ? `@${creator.name}` : fact.source;
  const creatorAvatar = creator?.avatar || "";
  const openCreatorProfile = () => {
    if (!creator?._id) return;
    router.push(`/creator/${creator._id}`)
  }

  const openOwnProfile = () => {
    if (user?._id || user?.id) {
      router.push(`/profile${user._id ? `?userId=${user._id}` : user.id ? `?userId=${user.id}` : ""}`)
      return
    }
    setShowAuth(true)
  }

  return (
    <div
      ref={cardRef}
      className="h-screen  snap-start relative overflow-hidden">  
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src={fact.image ||
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
        }  
          alt={fact.title}
          className="absolute inset-0 w-full h-full object-cover scale-100 opacity-55 blur-[2px] brightness-[0.55] pointer-events-none"/>
 
        <div className="absolute inset-0 bg-black/35 pointer-events-none" /> 
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.45)_35%,transparent_75%)] pointer-events-none "/> 
        <div className={`absolute inset-0 bg-linear-to-b ${theme.overlay} via-transparent to-black/70 pointer-events-none`} />

      </div>
 
      <div className="relative z-10 w-full max-w-105 mx-auto h-full px-4 py-5 flex flex-col text-white">
 
        <div className="flex justify-between items-center">

          <div
            onClick={creator?._id ? openCreatorProfile : undefined}
            className={`bg-white/12 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-3 py-2 flex items-center gap-2 ${creator?._id ? "cursor-pointer" : ""}`}
          >

            {creatorAvatar ? (
              <img src={creatorAvatar} alt={creator?.name || fact.source} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-500" />
            )}

             <p className="text-sm">{creatorLabel}</p>
             
          </div>

          <div className="flex gap-2">
            <div  onClick={openOwnProfile}  className="  h-10 w-10 rounded-full  bg-white/20  flex items-center justify-center  cursor-pointer  active:scale-95  transition-all duration-300">
              {user ? (<div className=" w-7 h-7 rounded-full      bg-white text-black      text-xs font-semibold      flex items-center justify-center    ">  
                  {user.name?.[0] || user.email?.[0]}  </div>  ) : (  <User size={18} /> )}
                    </div>

            <div
              onClick={onOpenSearch}
              className=" h-10 w-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
            >
                         <Search size={20} />
            </div>

            <div
              onClick={handleGridMenu}
              className=" h-10 w-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
            >
              <Grid2x2 size={20} />
            </div>

          </div>

        </div>
 
        <div className="mt-12">

          <p className="text-white/70 mb-2">
            Daily report
          </p>

          
          <h1
  className="text-6xl sm:text-7xl font-extralight leading-[0.9] line-clamp-4 max-w-77.5 racking-tight "
            style={{
              textShadow: "0 4px 30px rgba(0,0,0,0.7)"
            }}
          >
            {fact.title}
          </h1>

        </div>
 
        <div className=" absolute bottom-28 left-1/2 -translate-x-1/2  w-[320px] space-y-4 ">
 
          <div className="grid grid-cols-2 gap-3">

   <div  className={` h-32.5 rounded-[28px] p-4  bg-white/8 backdrop-blur-xl
      border border-white/8 shadow-xl `}>
    <p className="text-6xl font-bold leading-none">
    {fact.views || 0}
  </p>

    <p className="mt-2 text-sm text-white/70">
    Reads
  </p>
    <p className="mt-1 text-sm text-white/55">
    {creatorLabel}
  </p>
</div>

<div
  onClick={() => {
    setShowSummary(false)
    setShowModal(true)
  }}
  className={`
    h-30
    min-h-30
    max-h-30
    rounded-[28px]
    p-4
    bg-white/8
    backdrop-blur-xl
    border border-white/8
    shadow-xl
    cursor-pointer
    active:scale-[0.98]
    transition-all duration-300
    overflow-hidden
  `}
>
    <h3 className="text-lg font-light mb-2 tracking-tight">
    About
  </h3>
   
    <p className="text-zinc-300 text-sm leading-5 line-clamp-4 overflow-hidden">
  {cardPreview}
  {fullDescription.length > 100 && "..."}
</p>

</div>          
          </div>
 
          <div className="grid grid-cols-2 gap-4">

            <div className={` rounded-4xl  p-6 h-36 bg-white/10 backdrop-blur-xl border border-white/10
            shadow-xl flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all duration-300`}>


              <div onClick={() => window.open(fact.url, "_blank") } className="...">
                      <p className="text-base">Read Docs</p>
              </div>

              <div className="self-end">
                <CirclePlus size={40} />
              </div>

            </div>

            <div
              onClick={() =>  requireAuth(toggleSave)}
              className={`rounded-4xl p-6  h-36 bg-white/10 backdrop-blur-xl border border-white/10
              shadow-xl  flex flex-col justify-between cursor-pointer  active:scale-95 transition-all duration-300`}

            >

              <p className="text-base">
                {isSaved ? "Saved" : "Save Fact"}
              </p>

              <div className="self-end">
                <Bookmark  size={40} fill={isSaved ? "white" : "none"}
                         className="cursor-pointer"
                  />
 

              </div>

            </div>

          </div>

        </div>
 
        {showFooterActions && (
          <div className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          w-[320px]
          flex justify-between
          text-white
        ">
          <Home size={20} />
          <Clock3 onClick={onOpenHistory} size={20} className="cursor-pointer" />
          <Bookmark onClick={onOpenSaved} size={20} className="cursor-pointer" />
          <Grid2x2 size={20} />
          </div>
        )}

      </div>
 
      {showModal && (

        <div
        onClick={() => setShowModal(false)}
        className="
        fixed inset-0 z-50
        bg-black/68
        backdrop-blur-2xl
        flex items-center justify-center
        p-6
        animate-in fade-in duration-300
      ">

          <div
          onClick={(e) => e.stopPropagation()}
          className="
          w-full max-w-130
          h-[72vh]
          max-h-190
          rounded-[40px]
          bg-white/8
          border border-white/12
          backdrop-blur-3xl
          px-8 pt-10 pb-16
          text-white
          relative
          flex flex-col
          shadow-[0_18px_64px_rgba(0,0,0,0.35)]
          animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
        ">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/60"
            >
              <X size={22} />
            </button>

             <h2 className="text-[2.5rem] sm:text-[3rem] font-extralight leading-[0.95] tracking-tight mb-4 pr-10">
               {fact.title}

               </h2>

<p className="text-white/55 text-base mb-6 tracking-wide uppercase">
  {fact.source}
</p>

            <div className="flex-1 overflow-y-auto pr-1 pb-3">
              {showSummary && summary ? (
                <div className="
                  mt-1
                  rounded-[26px]
                  p-5
                  bg-cyan-500/8
                  border border-cyan-300/25
                  backdrop-blur-xl
                  animate-in fade-in slide-in-from-bottom-3 duration-500
                ">
                  <h3 className="mb-3 text-base font-light tracking-[0.08em] text-white/75">
                    ✨ AI Generated Summary
                  </h3>

                  <p className="text-base text-zinc-200 leading-7 whitespace-pre-line">
                    {summary}
                  </p>
                </div>
              ) : (
                <p className="text-base text-zinc-200 leading-7 whitespace-pre-line animate-in fade-in duration-300">
                  {fullDescription}
                </p>
              )}

              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-8 text-base text-white/80 hover:text-white transition-colors"
              >
                Read full article ↗
              </a>
            </div>

            <button
              onClick={handleSummarize}
              disabled={loadingSummary}
              className="
                absolute bottom-6 right-6
                h-11 w-11 rounded-full
                bg-white/14
                border border-white/20
                backdrop-blur-xl
                flex items-center justify-center
                shadow-lg
                transition-all duration-300
                hover:bg-white/20
                active:scale-95
                disabled:opacity-70
              "
              aria-label="Generate AI summary"
              title="Generate AI summary"
            >
              {loadingSummary ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
            </button>
 


  

          </div>

        </div>

      )}
{showAuth && (

  <div
    onClick={() => setShowAuth(false)}
    className="
    fixed inset-0 z-50
    bg-black/70
    backdrop-blur-md
    flex items-center justify-center
    p-6
  ">

    <div
      onClick={(e) => e.stopPropagation()}
      className="
      w-full max-w-sm
      rounded-[36px]
      bg-white/10
      border border-white/10
      backdrop-blur-2xl
      p-7
      text-white
      relative
    ">

      <button
        onClick={() => setShowAuth(false)}
        className="
          absolute top-4 right-4
          text-white/60
        "
      >
        <X size={24} />
      </button>

      <h2 className="text-[2rem] sm:text-[2.25rem] mb-2 leading-tight">

        {isSignup
          ? "Create account"
          : "Welcome back"
        }

      </h2>

      <p className="text-base leading-7 text-white/60 mb-8">

        {isSignup
          ? "Sign up to save your tech facts"
          : "Login to continue"
        }

      </p>

      <div className="space-y-4">

        <input
            type="email"
  placeholder="Email"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
          className=" w-full bg-white/10  border border-white/10  rounded-2xl  px-4 py-4  outline-none "/>
         <input  type="password"  value={password}  onChange={(e) =>
             setPassword(e.target.value)
  }
          placeholder="Password"
          className=" w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none "/>
           {isSignup && (

          <input type="password" placeholder="Confirm Password"
            className=" w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none"/>
             )}

           <button
  onClick={async () => {

    try {

      const endpoint =
        isSignup
          ? "/signup"
          : "/login"

      const res = await fetch(
        `http://localhost:5000/api/auth${endpoint}`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })

        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }

      localStorage.setItem(
        "token",
        data.token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      )

      setUser(data.user)
      window.dispatchEvent(new Event("techreel-auth-changed"))

      setShowAuth(false)

      setEmail("")
      setPassword("")

    } catch (err) {

      console.log(err)

    }

  }}

  className="
    w-full
    rounded-2xl
    py-4
    bg-white
    text-black
    font-medium
    mt-2
    active:scale-[0.98]
    transition-all duration-300
  "
>

  {isSignup
    ? "Create Account"
    : "Continue"
  }

</button>
                 <p onClick={() => setIsSignup(prev => !prev) }
                 className="text-sm text-white/60 text-center mt-5 cursor-pointer" >
                  {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"
          }

        </p>

      </div>

    </div>

  </div>

)}
      

  </div>

)}

   