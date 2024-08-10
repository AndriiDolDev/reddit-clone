"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/api/root";
import React, { FC } from "react";
import PostItem from "./PostItem";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "./CommentList";
interface PostListProps {
  session: any;
}

const PostList: FC<PostListProps> = ({ session }) => {
  // const api = createTRPCReact<AppRouter>();
  const { mutate } = api.post.createPost.useMutation();
  const { data, refetch } = api.post.getAllPosts.useQuery();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      postName: "",
      postDescription: "",
    },
  });
  // const { mutate } = api.post.setLike.useMutation();
  // const onSubmit = () => {
  //   mutate({
  //     id: "b44ff3bb-cde1-4bed-a71c-32cc9c90df60",
  //   });

  //   console.log(session.user);
  // };
  const onSubmit = (data) => {
    mutate({
      name: data.postName,
      description: data.postDescription,
    });
    setTimeout(() => refetch(), 300);
    reset();
  };

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      {session && (
        <div className="mb-10 min-w-[700px] space-y-2 rounded-xl border bg-white p-4 shadow-md">
          <div className="flex flex-row gap-4">
            <div>
              <img
                src={session.user.image}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <div className="w-full border-b pb-2">
              <Controller
                control={control}
                name="postName"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      className="Inter mb-4 h-[20px] border-0 tracking-wide"
                      placeholder="Title of your post"
                    ></Input>
                  );
                }}
              />
              <Controller
                control={control}
                name="postDescription"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      className="Inter h-[20px] border-0 tracking-wide"
                      placeholder="Share your thoughts with the world!"
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Button
              size="sm"
              className="self-end"
              onClick={handleSubmit(onSubmit)}
            >
              Post
            </Button>
          </div>
        </div>
      )}
      {data && (
        <div className="space-y-6">
          {data?.map((item, idx) => {
            return <PostItem postItem={item} key={idx} />;
          })}
        </div>
      )}
    </div>
  );
};

export default PostList;
