"use client"

import { useEffect, useState } from "react"

import ReelCard from "@/components/reel/ReelCard"
import SkeletonReel from "@/components/SkeletonReel"

export default function Home() {

  const [facts, setFacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchFacts = async () => {

      try {

         const res = await fetch("http://localhost:5000/api/facts")
        const data = await res.json()

        setFacts(data)

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)

      }

    }

    fetchFacts()

  }, [])

  if (loading) {
    return <SkeletonReel />
  }

  return (

    <div
      className="
      h-screen
      overflow-y-scroll
      snap-y
      snap-mandatory
      scroll-smooth
    "
    >

      {facts.map((fact, index) => (

        <ReelCard
          key={index}
          fact={fact}
        />

      ))}

    </div>

  )
}