const { dateToString } = require("../helpers/date");
const { transformEvent } = require("./merge");
const Event = require("../../models/event");
const User = require("../../models/user");
module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      //.populate("creator") //.find() will give all the events because we did not use any filters like title, description etc. populate will check for relation (ref:"User")
      return events.map((event) => {
        //events returned by mongoose has some metadata attached to it so we will use map function
        return transformEvent(event); //now this will give data without metadata
        // the code works even if we remove _id: event._doc._id.toString() .... the function of this is to convert the id to string as it might not be returned in string type
      });
    } catch (err) {
      console.log(err);
    }
  },

  createEvent: async (args, req) => {
    // const event = {
    //   _id: Math.random().toString(),
    //   title: args.eventInput.title,
    //   description: args.eventInput.description,
    //   price: +args.eventInput.price, // + is to make sure that the input is converted to number
    //   date: args.eventInput.date,
    // };

    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price, // + is to make sure that the input is converted to number
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });

    let createdEvent;
    try {
      const result = await event //return to let know that this an async operation and you have to wait
        .save();

      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      // console.log(result);
      //return { ...result._doc, _id: event.id }; // instead of using  _id: event._doc._id.toString()  we can also use  _id: event.id  as .id is inbuilt in mongoose to return id in string
      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
