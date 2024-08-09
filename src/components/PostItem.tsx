"use client";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { formatTimeAgo } from "utils/helpers";

interface PostItemProps {
  postItem: any;
}

const PostItem: FC<PostItemProps> = ({ postItem }) => {

  const router = useRouter();

  return (
    <div
      className="flex min-w-[700px] gap-4 self-center border-b p-4 pb-6 hover:bg-black/5 hover:opacity-90"
      onClick={() => router.push(`/post/${postItem.id}`)}
    >
      <div className="flex flex-col items-center self-center">
        <img src="./chevrons-up.svg" />
        <h1>{postItem.likeCount ?? "0"}</h1>
        <img src="./chevrons-down.svg" />
      </div>
      <div>
        <div className="flex gap-2">
          <img
            src={postItem.userImage ?? ""}
            width={24}
            height={24}
            className="rounded-full"
          />
          <h1 className="text-sm text-gray-600">{`Posted by ${postItem.userName}`}</h1>
          <h1 className="text-sm text-gray-600">
            {formatTimeAgo(postItem.createdAt)}
          </h1>
        </div>
        <h1 className="font-medium mb-4">{postItem.name}</h1>
        <h1 className="text-sm text-gray-700">{postItem.description}</h1>
      </div>
    </div>
  );
};

export default PostItem;
