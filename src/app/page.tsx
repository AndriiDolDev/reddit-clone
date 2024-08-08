import PostList from "@/components/PostList";
import SideBar from "@/components/SideBar";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex">
      <SideBar session={session}></SideBar>
      <PostList session={session}></PostList>
    </main>
  );
}
