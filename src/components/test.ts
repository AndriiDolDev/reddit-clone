"use server";
import { appRouter } from "@/server/api/root";

export const test = () => {
  const test = appRouter.post.createComment({
    name: "test",
    description: "121",
  });
};
