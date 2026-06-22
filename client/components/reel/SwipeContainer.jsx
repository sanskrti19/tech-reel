"use client";

import { useEffect, useRef, useState } from "react";
import ReelCard from "./ReelCard";
import SkeletonReel from "../SkeletonReel";

export default function SwipeContainer() {
  const viewedPosts = useRef(new Set());

  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const markViewed = async (postId) => {
    if (!postId) return;

    console.log("VIEW:", postId);

    if (viewedPosts.current.has(postId)) {
      return;
    }

    viewedPosts.current.add(postId);

    try {
      await fetch(
        `http://localhost:5000/api/posts/${postId}/view`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getFacts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/posts?page=1&limit=10"
        );

        const data = await response.json();

        setFacts(data.posts || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getFacts();
  }, []);

  if (loading) {
    return <SkeletonReel />;
  }

  return (
    <div
      className="
        h-screen
        overflow-y-scroll
        snap-y
        snap-mandatory
      "
    >
      {facts.map((fact) => (
        <ReelCard
          key={fact._id}
          fact={fact}
          markViewed={markViewed}
        />
      ))}
    </div>
  );
}