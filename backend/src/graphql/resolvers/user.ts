import {
  CreateUserResponse,
  CreateUsernameResponse,
  GraphQLContext,
} from '../../../util/types';


const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUser: async (
      _: any,
      args: { email: string; password: string },
      context: GraphQLContext
    ): Promise<CreateUserResponse> => {
      const { email, password } = args;
      const { prisma, session } = context;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existingUser) {
          return {
            error: 'Username already taken',
          };
        }
        /////
        await prisma.user.create({
          data: { email, password },
        });
        return { success: true };
      } catch (error: any) {
        console.log('createUsername error', error);
        return {
          
          error: error.message,
        };
      }
    },

    ////////////////////////
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        return {
          error: 'Not authorized',
        };
      }
      const { id: userId } = session.user;
      try {
        /**
         * Chech that username is not taken already
         */
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUser) {
          return {
            error: 'Username already taken',
          };
        }

        /**
         * Update username
         */

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });
        return { success: true };
      } catch (error: any) {
        console.log('createUsername error', error);
        return {
          error: error.message,
        };
      }
    },
  },
};

export default resolvers;
