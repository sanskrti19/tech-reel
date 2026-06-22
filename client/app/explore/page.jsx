"use client"

import { useEffect, useState } from "react"

import ReelCard from "@/components/reel/ReelCard"
import SkeletonReel from "@/components/SkeletonReel"

export default function ExplorePage() {
   const [facts, setFacts] = useState([])
const [loading, setLoading] = useState(true)

const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)


const fetchPosts = async (pageNum) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/posts?page=${pageNum}&limit=10`
    )

    const data = await res.json()

    setFacts(prev => [
      ...prev,
      ...data.posts
    ])

    setHasMore(data.hasMore)

  } catch (err) {
    console.log(err)
  } finally {
    setLoading(false)
  }
}

    useEffect(() => {
  fetchPosts(1)
}, [])

  if (loading) {
    return <SkeletonReel />
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {facts.map((fact, index) => (
        <ReelCard key={index} fact={fact} />
      ))}
    </div>
  )
}
