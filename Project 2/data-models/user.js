const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    cart: {
      type: Object,
    },
  },
  { timestamps: true }
);

//Cant use arrow function here because I am using *this*
// userSchema.pre("save", async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(2);
//     const hashedPass = await bcrypt.hash(this.password, salt);
//     this.password = hashedPass;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
