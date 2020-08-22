import { MyContext } from "./../types"
import "reflect-metadata"
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql"
import { Post } from "./../entities/Post"

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {})
  }
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id })
  }
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const newPost = em.create(Post, { title })
    await em.persistAndFlush(newPost)
    return newPost
  }
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const postToUpdate = await em.findOne(Post, { id })
    if (!postToUpdate) {
      return null
    }
    if (typeof title !== "undefined") {
      postToUpdate.title = title
      await em.persistAndFlush(postToUpdate)
    }
    return postToUpdate
  }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
