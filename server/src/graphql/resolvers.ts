import User, { UserDocument } from '../models/User.js';
import { signToken } from '../services/auth.js';

interface GraphQLContext {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

interface BookInput {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image?: string;
  link?: string;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext): Promise<UserDocument | null> => {
      console.log('Context user:', context.user); // Debug log
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }
      return User.findById(context.user._id);
    },
  },
  Mutation: {
    addUser: async (
      _parent: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ): Promise<{ token: string; user: UserDocument }> => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (err: unknown) {
        console.error('Error during user creation:', err);
        if (err instanceof Error && err.message.includes('duplicate key error')) {
          throw new Error('A user with this username or email already exists.');
        }
        throw new Error('Failed to create user. Please try again.');
      }
    },
    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: UserDocument }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (
      _parent: unknown,
      { book }: { book: BookInput },
      context: GraphQLContext
    ): Promise<UserDocument | null> => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (
      _parent: unknown,
      { bookId }: { bookId: string },
      context: GraphQLContext
    ): Promise<UserDocument | null> => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;




