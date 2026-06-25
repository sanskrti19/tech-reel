"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import {Search, Home,Bookmark,Grid2x2,Clock3,CirclePlus,User,X} from "lucide-react"

import { useEffect, useState, useRef } from "react"

 export default function ReelCard({
  fact,
  markViewed
}) {
  const cardRef = useRef(null)

  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    let timerId = null

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
          if (!timerId) {
            timerId = setTimeout(() => {
              if (markViewed) {
                markViewed(fact._id)
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
        threshold: 0.8,
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
 

   const [saved, setSaved] = useState(false)
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
  const preview =
  fact.description?.slice(0, 250);
  const theme =
    themes[fact.title?.length % themes.length]

  useEffect(() => {
    const savedFacts =
      JSON.parse(localStorage.getItem("savedFacts")) || []

    const exists = savedFacts.some(
      item => item.title === fact.title
    )

    setSaved(exists)
  }, [fact.title])

  const toggleSave = () => {
  const token = localStorage.getItem("token");

   if (!token) {
  setShowAuth(true);
  return;
  }
  const savedFacts =
    JSON.parse(localStorage.getItem("savedFacts")) || [];

  const exists = savedFacts.some(
    item => item.title === fact.title
  );

  let updated;

  if (exists) {
    updated = savedFacts.filter(
      item => item.title !== fact.title
    );

    setSaved(false);
  } else {
    updated = [...savedFacts, fact];

    setSaved(true);
  }

  localStorage.setItem(
    "savedFacts",
    JSON.stringify(updated)
  );
};

 
    const savedFacts =
      JSON.parse(localStorage.getItem("savedFacts")) || []

  
 
  
  const requireAuth = (callback) => {

  if (!user) {
    setShowAuth(true)
    return
  }

  callback()
}

  return (
     <div
       ref={cardRef}
       className="
         h-screen
         snap-start
         relative
         overflow-hidden
       "
     >  
      <div className="absolute inset-0 overflow-hidden">

        <img

        src={
  fact.image ||
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
}
       
          alt={fact.title}
          className="absolute inset-0 w-full h-full object-cover scale-100 opacity-55 blur-[2px] brightness-[0.55]
        "
        />
 
        <div className="absolute inset-0 bg-black/35" />
 
        <div
          className="
          absolute inset-0
          bg-[radial-gradient(circle_at_50%_38%,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.45)_35%,transparent_75%)]
        "
        />
 
        <div
          className={`
          absolute inset-0
          bg-gradient-to-b
          ${theme.overlay}
          via-transparent
          to-black/70
        `}
        />

      </div>
 
      <div className="relative z-10 w-full max-w-[420px] mx-auto h-full px-4 py-5 flex flex-col text-white">
 
        <div className="flex justify-between items-center">

          <div className="bg-white/12 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-3 py-2 flex items-center gap-2">

            <div className="w-8 h-8 rounded-full bg-zinc-500" />

             <p className="text-sm">
  {fact.source}
</p>

          </div>

          <div className="flex gap-2">
            <div  onClick={() => setShowAuth(true)}  className="  h-10 w-10 rounded-full  bg-white/20  flex items-center justify-center  cursor-pointer  active:scale-95  transition-all duration-300">
               {user ? (<div className=" w-7 h-7 rounded-full      bg-white text-black      text-xs font-semibold      flex items-center justify-center    ">  
                    {user.name?.[0]}  </div>  ) : (  <User size={18} /> )}
                    </div>

            <div className="
            h-10 w-10 rounded-full
            bg-white/20
            flex items-center justify-center
          ">
              <Search size={18} />
            </div>

            <div className="
            h-10 w-10 rounded-full
            bg-white/20
            flex items-center justify-center
          ">
              <Grid2x2 size={18} />
            </div>

          </div>

        </div>
 
        <div className="mt-12">

          <p className="text-white/70 mb-2">
            Daily report
          </p>

          <h1
            className="
            text-[58px]
            leading-[0.95]
            font-extralight
            line-clamp-4
            max-w-[300px]
            overflow-hidden
            tracking-tight
          "
            style={{
              textShadow: "0 4px 30px rgba(0,0,0,0.7)"
            }}
          >
            {fact.title}
          </h1>

        </div>
 
        <div className="
        absolute
        bottom-28
        left-1/2
        -translate-x-1/2
        w-[370px]
        space-y-4
      ">
 
          <div className="grid grid-cols-2 gap-4">

            <div className={`
            rounded-[32px]
            p-6
            bg-white/10
            backdrop-blur-xl
            border border-white/10
            shadow-2xl
            ${theme.glow}
          `}>

               <p className="text-6xl font-bold">
                 {fact.views || 0}
               </p>
              <p className="mt-4 text-white/70">
                Reads
              </p>

            </div>

            <div
              onClick={() => setShowModal(true)}
              className={`rounded-[32px] p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl ${theme.glow} cursor-pointer active:scale-[0.98]
               transition-all duration-300
            `}
            >

              <h3 className="text-xl">
                About
              </h3>

              <p className="text-zinc-300 leading-3">
  {preview}
  {fact.description?.length > 250 && "..."}
</p>
<div className="mt-3 flex gap-3">
  <button>
    Read More
  </button>

  <button>
    ✨ Summarize
  </button>
</div>

              {/* <p className="text-sm mt-4 leading-6 text-white/70 line-clamp-4">
                {fact.description}
              </p> */}

            </div>

          </div>
 
          <div className="grid grid-cols-2 gap-4">

            <div className={`
            rounded-[32px]
            p-6
            h-36
            bg-white/10
            backdrop-blur-xl
            border border-white/10
            shadow-2xl
            ${theme.glow}
            flex flex-col justify-between
            cursor-pointer
            active:scale-[0.98]
             transition-all duration-300
          `}>

              <div
  onClick={() =>
    window.open(fact.url, "_blank")
  }
  className="..."
>
  <p>Read Docs</p>
</div>

              <div className="self-end">
                <CirclePlus size={38} />
              </div>

            </div>

            <div
              onClick={() =>  requireAuth(toggleSave)}
              className={`
              rounded-[32px]
              p-6
              h-36
              bg-white/10
              backdrop-blur-xl
              border border-white/10
              shadow-2xl
              ${theme.glow}
              flex flex-col justify-between
              cursor-pointer
              active:scale-95
              transition-all duration-300
            `}
            >

              <p>
                {saved ? "Saved" : "Save Fact"}
              </p>

              <div className="self-end">
                <Bookmark
                   size={38}
                      onClick={toggleSave}
                     fill={saved ? "white" : "none"}
                    className="cursor-pointer"
                  />
 

              </div>

            </div>

          </div>

        </div>
 
        <div className="
        absolute
        bottom-8
        left-1/2
        -translate-x-1/2
        w-[320px]
        flex justify-between
        text-white
      ">

          <Home />
          <Clock3 />
          <Bookmark />
          <Grid2x2 />

        </div>

      </div>
 
      {showModal && (

        <div className="
        fixed inset-0 z-50
        bg-black/70
        backdrop-blur-md
        flex items-center justify-center
        p-6
      ">

          <div className="
          w-full max-w-md
          rounded-[36px]
          bg-white/10
          border border-white/10
          backdrop-blur-2xl
          p-7
          text-white
          relative
        ">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/60"
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl mb-6">
              About
            </h2>

            <p className="text-zinc-300 leading-7">
  {preview}
  {fact.description?.length > 250 && "..."}
</p>


 
{/* 
            <p className="leading-7 text-white/80">
              {fact.description}
            </p> */}

          </div>

        </div>

      )}
{showAuth && (

  <div className="
    fixed inset-0 z-50
    bg-black/70
    backdrop-blur-md
    flex items-center justify-center
    p-6
  ">

    <div className="
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
        <X size={22} />
      </button>

      <h2 className="text-3xl mb-2">

        {isSignup
          ? "Create account"
          : "Welcome back"
        }

      </h2>

      <p className="text-white/60 mb-8">

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
          className=" w-fullbg-white/10 border border-white/10 rounded-2xl px-4 py-4 outline-none "/>
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

   