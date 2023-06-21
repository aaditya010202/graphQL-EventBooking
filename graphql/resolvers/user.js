const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
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
};
