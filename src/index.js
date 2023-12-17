import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { readFileSync } from "fs";

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const resolvers = {
  Query: {
    info: () => `This is API for Hackernews Clone`,
    feed: () => links,
    link: (id) => links.find(l => l.id === id), 
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  Mutation: {
    post: (_parent, args) => {
      let idCount = links.length
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (_parent, args) => {
      const link = links.find(l => l.id === args.id)
      if(args.description){
        link.description = args.description
      }
      if (args.url) {
        link.url = args.url
      }
      return link
    },
    deleteLink: (_parent, args) => {
      const link = links.find(l => l.id === args.id)
      links = links.filter(l => l.id !== args.id)
      return link
    }
  }
};

const server = new ApolloServer({
  typeDefs: readFileSync("src/schema.graphql", "utf-8"),
  resolvers,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
