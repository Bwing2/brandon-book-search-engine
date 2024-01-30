const { User } = require('../models');

// Imports JSON Web Token function, and authentication check.
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // Use underscore convention if param isnt going to be used in the body.
    // GraphQL first argument to resolver function is parent object, no parent here.
    // 3 parameters in resolver function required for context parameter.
    me: async (_, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    // login and addUser don't need context because they don't rely on state of user.
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw AuthenticationError;
      }

      // Generates JWT for user after login is authenticated.
      // Can be sent to client for authentication requests in the future.
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      const token = signToken(user);
      return { token, user };
    },

    // Pass in book object as an argument to access data in context.
    saveBook: async (_, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          // Filter object that updates document. Finds document where _id field matches context.user_id.
          { _id: context.user._id },
          // $addToSet is MongoDB update operator that adds value to array if it isnt already in array.
          // Adds book object to savedBooks array.
          { $addToSet: { savedBooks: book } },
          // Returns updated version of document, and runs schema validators before update.
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;
    },

    removeBook: async (_, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          // $pull operator in MongoDB is used to remove all instances of a value from array.
          { $pull: { savedBooks: { id: book.id } } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
