const mongoose = require("mongoose");


const Schema = mongoose.Schema;//schema created below

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } //to show or example the time a user has registered.
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

const Product = mongoose.model("Product", productSchema);//modelize the schema/use in the product table using the schema

module.exports = Product; //export to user later on
