import CommentList from "@/components/CommentList";
import SideBar from "@/components/SideBar";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import React from "react";

const page = async ({ params }: { params: { id: number } }) => {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex h-screen">
      <SideBar session={session}></SideBar>
      <CommentList session={session} postId={params.id} />
    </main>
  );
};

export default page;
