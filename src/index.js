import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "./resolvers.js";

export let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: readFileSync("src/schema.graphql", "utf-8"),
  resolvers,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});
const port = process.env.PORT || 4000

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async ({req, res}) => ({
    prisma,
  }),
});

console.log(`Server ready at: ${url}`);
