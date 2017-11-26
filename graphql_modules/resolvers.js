// import { Author, View, FortuneCookie } from "./connectors";
const Author = require("./connectors");
const View = require("./connectors");
const FortuneCookie = require("./connectors").FortuneCookie;

const resolvers = {
  Query: {
    author(_, args) {
      return Author.find({ where: args });
    },
    getFortuneCookie() {
      return FortuneCookie.getOne();
    }
  },
  Author: {
    posts(author) {
      return author.getPosts();
    }
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
    views(post) {
      return View.findOne({ postId: post.id }).then(view => view.views);
    }
  }
};

// export default resolvers;
module.exports = resolvers;
