import { buildSchema } from "type-graphql"
// import "class-validator"
import { ApolloServer } from "apollo-server-express"
import { Post } from "./entities/Post"
import { __prod__ } from "./constants"
import { MikroORM } from "@mikro-orm/core"
import mikroORMConfig from "./mikro-orm.config"
import express from "express"
import { PostResolver } from "./resolvers/post"

const main = async () => {
  const orm = await MikroORM.init(mikroORMConfig)
  await orm.getMigrator().up()

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log(`Server is on PORT 4000 (Graphql-Express)`)
  })

  const posts = await orm.em.find(Post, {})
  // console.log(posts)
}

main().catch((err) => console.error(err))
