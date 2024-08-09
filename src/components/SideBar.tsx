"use client";
import React, { FC } from "react";
import { Button } from "./ui/button";

import { Session } from "next-auth";
import Link from "next/link";
interface SideBarProps {
  session: Session | null;
}

const SideBar: FC<SideBarProps> = ({ session }) => {
  return (
    <div className="flex h-screen w-[200px] flex-col justify-between border-r-2 px-2 py-4">
      <div className="flex flex-col gap-1">
        <Button variant="outline">Home</Button>
        {session?.user ? (
          <Button variant="outline">My posts</Button>
        ) : (
          <Button asChild>
            <Link href={"/auth"}>Log in</Link>
          </Button>
        )}
      </div>
      {session?.user && (
        <div className="flex items-center gap-4">
          <img src={session?.user.image ?? ""} width={32} height={32} />
          <h2>{session?.user.name}</h2>
        </div>
      )}
    </div>
  );
};

export default SideBar;
