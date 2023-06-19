const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    //list of events that a user creates
    {
      type: Schema.Types.ObjectId, // data type of the event
      ref: "Event", //Event is the event.js file which we want to connect since the event was exported as Event.
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
