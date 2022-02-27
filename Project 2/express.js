const express = require("express");
const mongoose = require("mongoose");//mongoose is mongodb but easier to implement in javascript, to use the functions of mongodb but in an easier way.

const bcrypt = require("bcrypt");//npm to hash the password.
const XMLHttpRequest = require("xhr2");//for news api, to use ajax inside express.js, we did it as a plus
const adminPanel = require("./routes/admin-panel");
//ajax is to get and post to the server without refreshing the page.
const app = express();
//get and post from the server
app.use(express.urlencoded({ extended: true })); //facebook.com/login?username:joe


let currentResult = null;//info of the user get stored in current result
let newsAPI = null; //initialize the news api
const salt = 10; // for hashing of type 10 salt;
//Setting Up Our Database


const User = require("./data-models/user");
const Product = require("./data-models/product");
app.use("/admin-panel", adminPanel);//to clean the code.

//setting up the database.
const server = "127.0.0.1:27017";
const dbname = "electrify";
mongoose
  .connect(`mongodb://${server}/${dbname}`)
  .then(() => {
    const port = 3030;
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error");
  });

//Making the login form static in order to send it in the intial state
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));//making css files static to be able to get rendered.
app.use("/img", express.static(__dirname + "/public/images"));
app.use("/loginform", express.static(__dirname + "/public/loginform"));//making the login form static 

//Setting up our templating engine
//app.use(expressLayouts);
app.set("view engine", "ejs");//set templating engine to ejs.

//Main Page
app.get("/home", (req, res) => {//request and response
  console.log(newsAPI);
  const xhttp = new XMLHttpRequest();
//ajax, first we open, then type get or post.
  xhttp.open(
    "get",
    "https://newsapi.org/v2/everything?q=technology&from=2021-12-11&sortBy=popularity&apiKey=c7dc8f74d77e4c619e6bf8629d9646a4"
  );
  xhttp.send();//send the request to the api.
  xhttp.onload = function () {
    newsAPI = JSON.parse(this.responseText);//response text bi alb l xhttp
    //console.log(newsAPI.articles[0].title);
    res.render("index", { account: currentResult, news: newsAPI });
  };
  // res.render("index", { account: currentResult, news: newsAPI });
});
app.get("/aboutus", (req, res) => {
  res.render("aboutus", { account: currentResult });
});
app.get("/products", (req, res) => {
  let allproducts = null;
  Product.find()//find everything from mongodb
    .select("name -_id price image")//remove id.
    .then((result) => {
      res.render("products", { account: currentResult, product: result });
    });
});
//Sign in
app.get("", (req, res) => {
  res.redirect("/signin");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", (req, res) => {
  console.log(req.body.pass);

  //get user information
  User.findOne({ email: req.body.email }).then((result1) => {
    console.log(result1);
    currentResult = result1;

    bcrypt.compare(req.body.pass, result1.password, function (err, result) {
      console.log(result);
      if (result) {
        if (result1.type == "USER") {
          console.log(newsAPI);
          const xhttp = new XMLHttpRequest();

          xhttp.open(
            "get",
            "https://newsapi.org/v2/everything?q=technology&from=2021-12-10&sortBy=popularity&apiKey=c7dc8f74d77e4c619e6bf8629d9646a4"
          );
          xhttp.send();
          xhttp.onload = function () {
            newsAPI = JSON.parse(this.responseText);
            console.log(newsAPI.articles[0].title);
            //console.log(newsAPI.articles[0].title);
            res.render("index", { account: result1, news: newsAPI });
          };
        } else {
          res.render("admin-panel", { account: result1 });
        }
      } else {
        res.render("signin");
      }
    });
  });
});

//Sign Up
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  console.log(req.body.pass);
  console.log(req.body.re_pass);

  if (req.body.pass == req.body.re_pass) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.pass,
      type: "USER",
    });

    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      console.log(user.password);
      user.save().then((result) => {
        console.log(result);
        res.render("signin");
      });
    });
  } else {
    res.render("signup");
  }
});

//user profile
app.get("/user-profile", (req, res) => {
  User.findOne({ email: currentResult.email }).then((result) => {
    currentResult = result;
    let cat = currentResult.cart;

    res.render("user-profile", { account: currentResult });
  });
});

app.get("/add-product-to-cart", (req, res) => {
  console.log("Hello");
  console.log(req.query.productName);//re.query is used when using get to retreive
  console.log(currentResult);
  User.findOneAndUpdate(//find the user and update its cart
    { name: currentResult.name },
    { $push: { cart: req.query.productName } },//(push to the array)to its cart the product

    function (error, success) { //callback function
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    }
  );
});
