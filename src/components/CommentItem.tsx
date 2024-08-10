"use client";
import { useRouter } from "next/navigation";
import React, { FC, useState, useEffect, useCallback } from "react";
import { formatTimeAgo } from "utils/helpers";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/api/root";
import { Input } from "./ui/input";
import { api } from "./CommentList";

interface CommentItemProps {
  postItem: any;
  session: any;
  postId: string;
  level?: number;
  createComment: any;
  refetchComments: any;
  submitComment: any;
}

interface RenderCommentItemProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  postItem: any;
  session: any;
  postId: string;
  level: number;
  refetchComments;
  submitComment: any;
}

const CommentItem: FC<CommentItemProps> = ({
  postItem,
  session,
  postId,
  level = 0,
  submitComment,
  refetchComments,
}) => {
  const RenderCommentItem: FC<RenderCommentItemProps> = ({
    postItem,
    session,
    postId,
    level,
    refetchComments,
    submitComment,
    ...rest
  }) => {
    const [showReply, setShowReply] = useState<boolean>(false);
    const { data: userLikes, refetch: refetchUserLiker } =
      api.post.getLikes.useQuery({
        userId: session.user.id,
      });

    const {
      data: nestedComments,
      isLoading,
      refetch,
    } = api.post.getNestedCommentsByCommentId.useQuery({
      commentId: postItem.id,
    });

    const { mutate: setLike } = api.post.setLike.useMutation({
      onSuccess: () => {
        refetchUserLiker();
        refetchComments();
      },
    });
    const { mutate: setDislike } = api.post.setDislike.useMutation({
      onSuccess: () => {
        // refetch();
        refetchUserLiker();
        refetchComments();
      },
    });

    const { handleSubmit, control, reset } = useForm({
      defaultValues: {
        comment: "",
      },
    });

    const createCommentMutation = api.post.createComment.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

    const onSubmit = (data: any) => {
      createCommentMutation.mutate({
        comment: data.comment,
        postId: postItem.postId,
        parentId: postItem.id,
      });
      reset();
      setShowReply(false);
    };

    const calculateWidth = () => {
      const baseWidth = 700;
      const newWidth = baseWidth - level * 40;
      return newWidth >= 300 ? newWidth : 300;
    };

    return (
      <>
        <div
          {...rest}
          style={{ minWidth: `${calculateWidth()}px` }}
          className={`self-center p-4 pb-6 ${level === 0 ? "border-b" : ""} ${rest.className}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <img
                src={postItem.userImage ?? ""}
                width={24}
                height={24}
                className="rounded-full"
              />
              <h1 className="text-sm text-gray-600">{`${postItem.userName}`}</h1>
              <h1 className="text-sm text-gray-600">
                {formatTimeAgo(postItem.createdAt)}
              </h1>
            </div>
            <h1 className="text-sm text-gray-700">{postItem.comment}</h1>
            <div className="flex gap-1">
              <div className="flex items-center gap-2 self-center">
                {userLikes?.likes?.includes(postItem.id) ? (
                  <img
                    src="./../active-chevrons-up.svg"
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLike({ id: postItem.id, userId: session.user.id });
                    }}
                  />
                ) : (
                  <img
                    src="./../chevrons-up.svg"
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLike({ id: postItem.id, userId: session.user.id });
                    }}
                  />
                )}

                <h1>{postItem.likeCount}</h1>
                {userLikes?.dislikes?.includes(postItem.id) ? (
                  <img
                    src="./../active-chevrons-down.svg"
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDislike({ id: postItem.id, userId: session.user.id });
                    }}
                  />
                ) : (
                  <img
                    src="./../chevrons-down.svg"
                    width={16}
                    height={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDislike({ id: postItem.id, userId: session.user.id });
                    }}
                  />
                )}
              </div>
              <Button
                variant="ghost"
                onClick={(e) => {
                  setShowReply((prev) => !prev);
                  e.stopPropagation();
                }}
              >
                <img src="./../comment.svg" className="mr-2" />
                Reply
              </Button>
            </div>
          </div>
          {showReply && (
            <div
              className="mb-10 space-y-2 rounded-xl border bg-white p-4 shadow-md"
              style={{ minWidth: `${calculateWidth()}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-row gap-4">
                <div>
                  <img
                    src={session?.user?.image ?? ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <div className="w-full border-b pb-2">
                  <Controller
                    control={control}
                    name="comment"
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          className="h-[20px]"
                          placeholder="Comment your thoughts"
                        ></Input>
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
          {!isLoading &&
            // nestedComments.innerComments > 0 &&
            nestedComments.innerComments.map((item, idx) => (
              <RenderCommentItem
                onClick={(e) => e.stopPropagation()}
                key={`${item.id}-${idx}`}
                postItem={item}
                session={session}
                postId={postId}
                level={level + 1}
                className="ml-[20px]"
                refetchComments={refetch}
              />
            ))}
        </div>
      </>
    );
  };

  return (
    <RenderCommentItem
      postItem={postItem}
      session={session}
      postId={postId}
      level={level}
      refetchComments={refetchComments}
    />
  );
};

export default CommentItem;
