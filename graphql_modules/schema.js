// import resolvers from "./resolvers";
// import { makeExecutableSchema } from "graphql-tools";
const resolvers = require("./resolvers");
const graphqlTools = require("graphql-tools");

const { makeExecutableSchema } = graphqlTools;
// import mocks from "./mocks";

const typeDefs = `
type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
}
type Query {
  author(firstName: String, lastName: String): Author
  getFortuneCookie: String
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

// addMockFunctionsToSchema({ schema, mocks });

module.exports = schema;
