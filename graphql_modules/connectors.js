// import Sequelize from "sequelize";
// import casual from "casual";
// import _ from "lodash";
// import Mongoose from "mongoose";
// import fetch from "node-fetch";

const Sequelize = require("sequelize");
const casual = require("casual");
const _ = require("lodash");
const Mongoose = require("mongoose");
const fetch = require("node-fetch");

/* SEQUELIZE STUFF */
const db = new Sequelize("blog", null, null, {
  dialect: "sqlite",
  storage: "./blog.sqlite"
});

const AuthorModel = db.define("author", {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING }
});

const PostModel = db.define("post", {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING }
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);
/* SEQUELIZE STUFF */

/* MONGO STUFF */
const mongo = Mongoose.connect("mongodb://localhost/views");

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number
});

const View = Mongoose.model("views", ViewSchema);
/* MONGO STUFF */

/* REST ENDPOINT STUFF */
exports.FortuneCookie = {
  getOne() {
    return fetch("http://fortunecookieapi.herokuapp.com/v1/cookie")
      .then(res => res.json())
      .then(res => {
        return res[0].fortune.message;
      });
  }
};
/* REST ENDPOINT STUFF */

// create mock data w/ a seed, so we always get the same
// modify the mock data creation to also create some views
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name
    }).then(author => {
      return author
        .createPost({
          title: `A post by ${author.firstName}`,
          text: casual.sentences(3)
        })
        .then(post => {
          return View.update(
            { postId: post.id },
            { views: casual.integer(0, 100) },
            { upsert: true }
          );
        });
    });
  });
});

exports.Author = db.models.author;
exports.Post = db.models.post;
exports.View;
// const Post = db.models.post;

// export { Author, Post, View, FortuneCookie };
