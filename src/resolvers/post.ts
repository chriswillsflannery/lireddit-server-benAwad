import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() ctx: MyContext
  ): Promise<Post[]> {
    return ctx.emFork.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    return ctx.emFork.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    const post = ctx.emFork.create(Post, { title });
    await ctx.emFork.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = await ctx.emFork.findOne(Post, { id });
    if (!post) {
      return null
    }
    if (typeof title !== undefined) {
      post.title = title;
      await ctx.emFork.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    try {
      await ctx.emFork.nativeDelete(Post, { id })
    } catch {
      return false;
    }
    return true;
  }
}