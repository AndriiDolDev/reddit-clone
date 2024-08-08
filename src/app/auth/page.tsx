import SignIn from "@/components/SignIn";
import { getServerAuthSession } from "@/server/auth";
import React from "react";

const page = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn session={session} />
    </div>
  );
};

export default page;
