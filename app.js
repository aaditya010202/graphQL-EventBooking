const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const app = express();
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

app.use(bodyParser.json());

// "events" and "createEvents" are called resolvers
// "!" will not return null string and also not null list of strings in RootQuery
// rootvalue has the resolver function
// when an incoming query requests the event property then the RootQuery function will be called inside the rootValue....suppose here events should return a list of events as in rootValue
// const eventName= args.name ..... name because we have defined name in createEvent

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.onkgtck.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
