export const resolvers = {
  Query: {
    info: () => `This is API for Hackernews Clone`,
    feed: async (_parent, _args, context) => {
      return await context.prisma.link.findMany();
    },
    link: async (_parent, args, context) => {
      return await context.prisma.link.findUnique({
        where: {
          id: args.id
        }
      });
    },
  },

  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },

  Mutation: {
    post: async (_parent, args, context, info) => {
      const newLink = await context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: async (_parent, args, context) => {
      const fields = {};

      if (args.description) {
        fields.description = args.description;
      }
      if (args.url) {
        fields.url = args.url;
      }

      const link = await context.prisma.link.update({
        where: {
          id: args.id,
        },
        data: {
          ...fields,
        },
      });

      return link;
    },
    deleteLink: async (_parent, args, context) => {
      const link = await context.prisma.link.delete({
        where: {
          id: args.id,
        },
      });
      return link;
    },
  },
};
