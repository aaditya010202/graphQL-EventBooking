const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../helpers/date");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventIds) => {
  try {
    const event = await Event.findOne(eventIds);
    return transformEvent(event);
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

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator), //user is the constant user below
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

//GADBAD CODEEEEEEE........
// const DataLoader = require("dataloader");
// const Event = require("../../models/event");
// const User = require("../../models/user");
// const { dateToString } = require("../helpers/date");

// const eventLoader = new DataLoader((eventIds) => {
//   return events(eventIds);
// });

// const userLoader = new DataLoader((userIds) => {
//   return User.find({ _id: { $in: userIds } });
// });

// const events = async (eventIds) => {
//   try {
//     const events = await Event.find({ _id: { $in: eventIds } });
//     events.sort((a, b) => {
//       return (
//         eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
//       );
//     });
//     console.log(events, eventIds);
//     return events.map((event) => {
//       return transformEvent(event);
//     });
//   } catch (err) {
//     throw err;
//   }
// };

// const singleEvent = async (eventId) => {
//   try {
//     const event = await eventLoader.load(eventId.toString());
//     return event;
//   } catch (err) {
//     throw err;
//   }
// };

// const user = async (userId) => {
//   try {
//     const user = await userLoader.load(userId.toString());
//     return {
//       ...user._doc,
//       _id: user.id,
//       createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
//     };
//   } catch (err) {
//     throw err;
//   }
// };

// const transformEvent = (event) => {
//   return {
//     ...event._doc,
//     _id: event.id,
//     date: dateToString(event._doc.date),
//     creator: user.bind(this, event.creator),
//   };
// };

// const transformBooking = (booking) => {
//   return {
//     ...booking._doc,
//     _id: booking.id,
//     user: user.bind(this, booking._doc.user),
//     event: singleEvent.bind(this, booking._doc.event),
//     createdAt: dateToString(booking._doc.createdAt),
//     updatedAt: dateToString(booking._doc.updatedAt),
//   };
// };

// exports.transformEvent = transformEvent;
// exports.transformBooking = transformBooking;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
