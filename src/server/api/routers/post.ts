import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts, comments, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  getLikes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));
      return {
        likes: user[0]?.likes || [],
        dislikes: user[0]?.dislikes || [],
      };
    }),

  createPost: protectedProcedure
    .input(
      z.object({ name: z.string().min(1), description: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.db
        .insert(posts)
        .values({
          name: input.name,
          description: input.description || "",
          createdById: ctx.session.user.id,
          userImage: ctx.session.user.image,
          userName: ctx.session.user.name,
        })
        .returning();

      return newPost[0];
    }),

  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        comment: z.string().min(1),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newComment = await ctx.db
        .insert(comments)
        .values({
          comment: input.comment,
          createdBy: ctx.session.user.id,
          postId: input.postId,
          parentId: input.parentId || null,
          userImage: ctx.session.user.image,
          userName: ctx.session.user.name,
        })
        .returning();
      return newComment[0];
    }),

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const postsList = (await ctx.db.select().from(posts)).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return postsList;
  }),

  setLike: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));

      async function likeSet(num: number) {
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id));

        if (post[0]) {
          await ctx.db
            .update(posts)
            .set({ likeCount: post[0]?.likeCount + num })
            .where(eq(posts.id, input.id));
        } else {
          const comment = await ctx.db
            .select()
            .from(comments)
            .where(eq(comments.id, input.id));
          if (comment[0]) {
            await ctx.db
              .update(comments)
              .set({ likeCount: comment[0]?.likeCount + num })
              .where(eq(comments.id, input.id));
          }
        }
      }

      const likes = user[0]?.likes?.filter((like) => like !== input.id) || [];
      const isLike = !!user[0]?.likes?.find((like) => like === input.id);
      const dislikes =
        user[0]?.dislikes?.filter((dislike) => dislike !== input.id) || [];
      const isDislike = !!user[0]?.dislikes?.find(
        (dislike) => dislike === input.id,
      );

      if (!isLike && !isDislike) {
        await likeSet(1);
        await ctx.db
          .update(users)
          .set({ likes: [...user[0]?.likes, input.id] })
          .where(eq(users.id, input.userId));
      } else if (!isLike) {
        await ctx.db
          .update(users)
          .set({ likes: [...user[0]?.likes, input.id], dislikes })
          .where(eq(users.id, input.userId));
        await likeSet(2);
      } else {
        await ctx.db
          .update(users)
          .set({ likes, dislikes })
          .where(eq(users.id, input.userId));
        await likeSet(-1);
      }
      console.log("324234324232");
      return { success: true };
    }),

  setDislike: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));

      async function likeSet(num: number) {
        const post = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id));

        if (post[0]) {
          await ctx.db
            .update(posts)
            .set({ likeCount: post[0]?.likeCount + num })
            .where(eq(posts.id, input.id));
        } else {
          const comment = await ctx.db
            .select()
            .from(comments)
            .where(eq(comments.id, input.id));
          if (comment[0]) {
            await ctx.db
              .update(comments)
              .set({ likeCount: comment[0]?.likeCount + num })
              .where(eq(comments.id, input.id));
          }
        }
      }

      const likes = user[0]?.likes?.filter((like) => like !== input.id) || [];
      const isLike = !!user[0]?.likes?.find((like) => like === input.id);
      const dislikes =
        user[0]?.dislikes?.filter((dislike) => dislike !== input.id) || [];
      const isDislike = !!user[0]?.dislikes?.find(
        (dislike) => dislike === input.id,
      );

      if (!isLike && !isDislike) {
        await likeSet(-1);
        await ctx.db
          .update(users)
          .set({ dislikes: [...user[0]?.dislikes, input.id] })
          .where(eq(users.id, input.userId));
      } else if (!isDislike) {
        await ctx.db
          .update(users)
          .set({ dislikes: [...user[0]?.dislikes, input.id], likes })
          .where(eq(users.id, input.userId));
        await likeSet(-2);
      } else {
        await ctx.db
          .update(users)
          .set({ dislikes, likes })
          .where(eq(users.id, input.userId));
        await likeSet(1);
      }

      return { success: true };
    }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.postId));
      return post[0];
    }),

  getCommentsByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const commentsList = (
        await ctx.db
          .select()
          .from(comments)
          .where(eq(comments.postId, input.postId))
      ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const data = commentsList.filter((item) => item.parentId === null);
      console.log(data);
      return { commentsData: data };
    }),

  getNestedCommentsByCommentId: publicProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const nestedComments = (
        await ctx.db
          .select()
          .from(comments)
          .where(eq(comments.parentId, input.commentId))
      ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return { innerComments: nestedComments };
    }),
});
