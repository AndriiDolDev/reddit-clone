"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/api/root";
import React, { FC, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CommentItem from "./CommentItem";
import { formatTimeAgo } from "utils/helpers";
import { useRouter } from "next/navigation";

interface CommentListProps {
  session: any;
  postId: string;
}

const CommentList: FC<CommentListProps> = ({ session, postId }) => {
  const api = createTRPCReact<AppRouter>();
  const router = useRouter();

  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any>(null);
  const [userLikes, setUserLikes] = useState<any>(null);

  const { mutate } = api.post.createComment.useMutation({
    // onSuccess: () => {
    //   fetchComments();
    //   fetchPostData();
    // },
  });

  const { mutate: setLike } = api.post.setLike.useMutation({
    // onSuccess: () => {
    //   fetchComments();
    //   fetchPostData();
    //   fetchUserLikes();
    // },
  });

  const { mutate: setDislike } = api.post.setDislike.useMutation({
    // onSuccess: () => {
    //   fetchComments();
    //   fetchPostData();
    //   fetchUserLikes();
    // },
  });

  const { data, refetch: refetchPost } = api.post.getPostById.useQuery({
    postId,
  });
  const fetchPostData = async () => {
    const data = await refetchPost();
    setPostData(data.data);
  };

  const { data: commentsData1, refetch: refetchComments } =
    api.post.getCommentsByPostId.useQuery({ postId });
  const fetchComments = async () => {
    const data = await refetchComments();
    setCommentsData(data.data?.commentsData);
  };

  const { data: userLikesData, refetch: refetchUserLikes } =
    api.post.getLikes.useQuery({
      userId: session.user.id,
    });
  const fetchUserLikes = async () => {
    const data = await refetchUserLikes();
    setUserLikes(data.data);
  };

  console.log(1);
  useEffect(() => {
    fetchPostData();
    fetchComments();
    fetchUserLikes();
  }, [fetchUserLikes, fetchPostData, fetchComments]);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<{ comment: string }> = (formData) => {
    mutate({
      postId: postId,
      comment: formData.comment,
      parentId: undefined,
    });

    reset();
  };

  return (
    <div className="mt-10 flex h-full w-full flex-col items-center">
      {postData && (
        <div className="min-w-[700px] pb-6">
          <Button
            variant="ghost"
            className="mb-4 p-0"
            onClick={() => router.back()}
          >
            <img src="./../arrow-left.svg" className="mr-2" />
            Back to posts
          </Button>
          <div className="flex gap-4 self-center">
            <div className="flex flex-col items-center self-center">
              {userLikes?.likes?.includes(postId) ? (
                <img
                  width={20}
                  height={20}
                  src="./../active-chevrons-up.svg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLike({ id: postId, userId: session.user.id });
                  }}
                />
              ) : (
                <img
                  width={20}
                  height={20}
                  src="./../chevrons-up.svg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLike({ id: postId, userId: session.user.id });
                  }}
                />
              )}
              <h1>{postData.likeCount}</h1>
              {userLikes?.dislikes?.includes(postId) ? (
                <img
                  src="./../active-chevrons-down.svg"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDislike({ id: postId, userId: session.user.id });
                  }}
                />
              ) : (
                <img
                  width={20}
                  height={20}
                  src="./../chevrons-down.svg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDislike({ id: postId, userId: session.user.id });
                  }}
                />
              )}
            </div>
            <div>
              <div className="flex gap-2">
                <img
                  src={postData?.userImage ?? ""}
                  width={24}
                  height={24}
                  className="rounded-full"
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
      )}
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
                name="comment"
                render={({ field }) => {
                  return <Input {...field} className="h-[20px]"></Input>;
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
      {commentsData && (
        <div className="space-y-6">
          {commentsData.map((item, idx) => {
            return (
              <CommentItem
                postItem={item}
                key={idx}
                session={session}
                postId={postId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentList;
