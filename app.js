const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const app = express();
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
app.use(bodyParser.json());

// "events" and "createEvents" are called resolvers
// "!" will not return null string and also not null list of strings in RootQuery
// rootvalue has the resolver function
// when an incoming query requests the event property then the RootQuery function will be called inside the rootValue....suppose here events should return a list of events as in rootValue
// const eventName= args.name ..... name because we have defined name in createEvent
const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return { ...user._doc, _id: user.id };
    })
    .catch((err) => {
      throw err;
    });
};
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
      creator: User!      
    }
    
    type User{
      _id: ID!
      email:String!
      password:String
      createdEvents: [Event!]
    }

    input EventInput{
      title:String!
      description:String!
      price:Float!
      date:String!
    }

    input UserInput{
      email:String!
      password:String!
    }
    type RootQuery{
      events: [Event!]! 
    }

    type RootMutation{
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput):User
    }

    schema{
      query:RootQuery
      mutation:RootMutation
    }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .populate("creator") //.find() will give all the events because we did not use any filters like title, description etc. populate will check for relation (ref:"User")
          .then((events) => {
            return events.map((event) => {
              //events returned by mongoose has some metadata attached to it so we will use map function
              return {
                ...event._doc,
                _id: event._doc._id.toString(),
                creator: user.bind(this, event._doc.creator),
              }; //now this will give data without metadata
              // the code works even if we remove _id: event._doc._id.toString() .... the function of this is to convert the id to string as it might not be returned in string type
            });
          })
          .catch((err) => {
            console.log(err);
          });
      },
      createEvent: (args) => {
        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.eventInput.title,
        //   description: args.eventInput.description,
        //   price: +args.eventInput.price, // + is to make sure that the input is converted to number
        //   date: args.eventInput.date,
        // };

        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price, // + is to make sure that the input is converted to number
          date: new Date(args.eventInput.date),
          creator: "649013fbaa4c0656dbf0cae0",
        });
        return event //return to let know that this an async operation and you have to wait
          .save()

          .then((result) => {
            createdEvent = { ...result._doc, _id: event.id };
            return User.findById("649013fbaa4c0656dbf0cae0");
            // console.log(result);
            //return { ...result._doc, _id: event.id }; // instead of using  _id: event._doc._id.toString()  we can also use  _id: event.id  as .id is inbuilt in mongoose to return id in string
          })
          .then((user) => {
            if (!user) {
              throw new Error("User not found.");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },

      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("User already exists");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPass) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPass,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null, _id: result.id }; //password is null because we do not want to see the encrypted password in the output as it is of no use
          })
          .catch((err) => {
            throw err;
          });
      },
    },
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
