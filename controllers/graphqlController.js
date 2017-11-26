const graphqlImport = require("graphql");
const graphql = graphqlImport;
// import schema from "../graphql_modules/schema";
const schema = require("../graphql_modules/schema");

exports.graphEndpoint = (req, res) => {
  res.send("It worked! ");
  // graphql(schema, req.body, { user: req.user }).then(data => {
  //   res.send("It worked! " + data);
  // });
};
