"use client";

import { useParams } from "next/navigation";
import ProfileView from "@/components/profile/ProfileView";

export default function CreatorPage() {
  const params = useParams();
  return <ProfileView userId={params.id} />;
}
