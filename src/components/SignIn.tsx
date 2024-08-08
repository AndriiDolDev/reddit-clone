"use client";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

interface SignInProps {
  session: Session | null;
}

const SignIn: FC<SignInProps> = ({ session }) => {
  const handleSignIn = () => {
    signIn("google");
  };
  if (session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium">Join the best community ever</h1>
        <h1 className="text-xl font-normal">Create an account today</h1>
      </div>
      <Button
        variant="outline"
        className="justify-start"
        onClick={handleSignIn}
      >
        <img src={"/Logo.svg"} width={20} height={20} className="mr-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default SignIn;
