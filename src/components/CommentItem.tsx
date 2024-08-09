"use client";
import { useRouter } from "next/navigation";
import React, { FC, useState, useEffect, useCallback } from "react";
import { formatTimeAgo } from "utils/helpers";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/api/root";
import { Input } from "./ui/input";

interface CommentItemProps {
  postItem: any;
  session: any;
  postId: string;
  level?: number;
}

const CommentItem: FC<CommentItemProps> = ({
  postItem,
  session,
  postId,
  level = 0,
}) => {
  const api = createTRPCReact<AppRouter>();
  const { mutate } = api.post.createComment.useMutation({});

  interface RenderCommentItemProps
    extends React.AllHTMLAttributes<HTMLDivElement> {
    postItem: any;
    session: any;
    postId: string;
    level: number;
  }

  const RenderCommentItem: FC<RenderCommentItemProps> = ({
    postItem,
    session,
    postId,
    level,
    ...rest
  }) => {
    const [showReply, setShowReply] = useState<boolean>(false);
    const [nestedComments, setNestedComments] = useState<any[]>([]);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const { mutate: setLike } = api.post.setLike.useMutation({
      onSuccess: () => {
        refetch();
        refetchUserLiker();
      },
    });
    const { mutate: setDislike } = api.post.setDislike.useMutation({
      onSuccess: () => {
        refetch();
        refetchUserLiker();
      },
    });
    const { data: userLikes, refetch: refetchUserLiker } =
      api.post.getLikes.useQuery({
        userId: session.user.id,
      });

    const { refetch } = api.post.getNestedCommentsByCommentId.useQuery({
      commentId: postItem.id,
    });

    const handleOnClickComment = useCallback(async () => {
      const { data } = await refetch();
      setNestedComments(data?.innerComments ?? []);
    }, [refetch]);

    const { handleSubmit, control, reset } = useForm({
      defaultValues: {
        comment: "",
      },
    });

    const onSubmit = async (data: any) => {
      await mutate({
        postId: postItem.postId,
        comment: data.comment,
        parentId: postItem.id,
      });

      reset();
    };

    useEffect(() => {
      if (level === 0) {
        if (isExpanded) {
          handleOnClickComment();
        } else {
          setNestedComments([]);
        }
      } else {
        handleOnClickComment();
      }
    }, [isExpanded, userLikes]);

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
            setIsExpanded((prev) => !prev);
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
          {nestedComments.map((item, idx) => (
            <RenderCommentItem
              onClick={(e) => e.stopPropagation()}
              key={`${item.id}-${idx}`}
              postItem={item}
              session={session}
              postId={postId}
              level={level + 1}
              className="ml-[20px]"
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
    />
  );
};

export default CommentItem;
