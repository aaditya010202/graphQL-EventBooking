const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const Booking = require("../../models/booking");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator), //user is the constant user below
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      //.populate("creator") //.find() will give all the events because we did not use any filters like title, description etc. populate will check for relation (ref:"User")
      return events.map((event) => {
        //events returned by mongoose has some metadata attached to it so we will use map function
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        }; //now this will give data without metadata
        // the code works even if we remove _id: event._doc._id.toString() .... the function of this is to convert the id to string as it might not be returned in string type
      });
    } catch (err) {
      console.log(err);
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          id: booking.id,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
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
      creator: "6491d0053ff21d56adff416e",
    });

    let createdEvent;
    try {
      const result = await event //return to let know that this an async operation and you have to wait
        .save();

      createdEvent = {
        ...result._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById("6491d0053ff21d56adff416e");
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

  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPass = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPass,
      });
      const result = await user.save();
      await { ...result._doc, password: null, _id: result.id }; //password is null because we do not want to see the encrypted password in the output as it is of no use
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "6491d0053ff21d56adff416e",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
};
