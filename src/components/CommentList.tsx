"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/api/root";
import React, { FC, useCallback } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CommentItem from "./CommentItem";
import { formatTimeAgo } from "utils/helpers";
import { useRouter } from "next/navigation";

interface CommentListProps {
  session: any;
  postId: string;
}

export const api = createTRPCReact<AppRouter>();

const CommentList: FC<CommentListProps> = ({ session, postId }) => {
  const router = useRouter();

  const { data: postData, refetch: refetchPost } =
    api.post.getPostById.useQuery(
      { postId },
      {
        refetchOnWindowFocus: false,
      },
    );

  const {
    data: commentsData,
    refetch: refetchComments,
    isLoading: isCommentsLoading,
  } = api.post.getCommentsByPostId.useQuery(
    { postId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: userLikesData, refetch: refetchLikes } =
    api.post.getLikes.useQuery(
      { userId: session?.user?.id },
      {
        enabled: !!session?.user?.id,
        refetchOnWindowFocus: false,
      },
    );

  const createCommentMutation = api.post.createComment.useMutation({
    onSuccess: () => {
      refetchComments();
    },
  });

  const setLikeMutation = api.post.setLike.useMutation({
    onSuccess: () => {
      refetchLikes();
    },
  });

  const setDislikeMutation = api.post.setDislike.useMutation({
    onSuccess: () => {
      refetchLikes();
    },
  });

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<{
    comment: string;
    parentId: string | undefined;
    id: string;
  }> = ({ comment, parentId = undefined, id = postId }) => {
    createCommentMutation.mutate({
      postId: id,
      comment: comment,
      parentId: parentId,
    });
    reset();
  };

  const handleLike = useCallback(() => {
    if (session?.user?.id) {
      setLikeMutation.mutate({ id: postId, userId: session.user.id });
    }
  }, []);

  const handleDislike = useCallback(() => {
    if (session?.user?.id) {
      setDislikeMutation.mutate({ id: postId, userId: session.user.id });
    }
  }, []);

  if (!postData) return null;

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      <div className="min-w-[700px] pb-6">
        <Button
          variant="ghost"
          className="mb-4 p-0"
          onClick={() => router.back()}
        >
          <img src="./../arrow-left.svg" className="mr-2" alt="Back arrow" />
          Back to posts
        </Button>
        <div className="flex gap-4 self-center">
          <div className="flex flex-col items-center self-center">
            <img
              width={20}
              height={20}
              src={
                userLikesData?.likes?.includes(postId)
                  ? "./../active-chevrons-up.svg"
                  : "./../chevrons-up.svg"
              }
              onClick={handleLike}
              alt="Like"
            />
            <h1>{postData.likeCount}</h1>
            <img
              width={20}
              height={20}
              src={
                userLikesData?.dislikes?.includes(postId)
                  ? "./../active-chevrons-down.svg"
                  : "./../chevrons-down.svg"
              }
              onClick={handleDislike}
              alt="Dislike"
            />
          </div>
          <div>
            <div className="flex gap-2">
              <img
                src={postData?.userImage ?? ""}
                width={24}
                height={24}
                className="rounded-full"
                alt="User avatar"
              />
              <h1 className="text-sm text-gray-600">{`Posted by ${postData?.userName}`}</h1>
              <h1 className="text-sm text-gray-600">
                {formatTimeAgo(postData?.createdAt)}
              </h1>
            </div>
            <h1 className="font-medium">{postData?.name}</h1>
            <h1 className="text-sm text-gray-700">{postData?.description}</h1>
          </div>
        </div>
      </div>
      {session && (
        <div className="mb-10 min-w-[700px] space-y-2 rounded-xl border bg-white p-4 shadow-md">
          <div className="flex flex-row gap-4">
            <div>
              <img
                src={session.user.image}
                width={24}
                height={24}
                className="rounded-full"
                alt="User avatar"
              />
            </div>
            <div className="w-full border-b pb-2">
              <Controller
                control={control}
                name="comment"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="h-[20px]"
                    placeholder="Comment your thoughts"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Button
              size="sm"
              className="self-end"
              onClick={handleSubmit(onSubmit)}
              disabled={createCommentMutation.isLoading}
            >
              {createCommentMutation.isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {isCommentsLoading ? (
          <p>Loading comments...</p>
        ) : (
          commentsData?.commentsData.map((item, idx) => (
            <CommentItem
              postItem={item}
              key={idx}
              session={session}
              postId={postId}
              refetchComments={refetchComments}
              submitComment={onSubmit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
