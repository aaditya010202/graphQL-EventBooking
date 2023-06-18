const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

const events = [];
// "events" and "createEvents" are called resolvers
// "!" will not return null string and also not null list of strings in RootQuery
// rootvalue has the resolver function
// when an incoming query requests the event property then the RootQuery function will be called inside the rootValue....suppose here events should return a list of events as in rootValue
// const eventName= args.name ..... name because we have defined name in createEvent
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Event{
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput{
      title:String!
      description:String!
      price:Float!
      date:String!
    }
    type RootQuery{
      events: [Event!]! 
    }

    type RootMutation{
      createEvent(eventInput: EventInput): Event
    }

    schema{
      query:RootQuery
      mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price, // + is to make sure that the input is converted to number
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);
