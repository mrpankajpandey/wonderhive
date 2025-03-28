if (process.env.NODE_ENV!="production") {
  require('dotenv').config()
  
}
const express = require("express");
const app = express();
const connectDB = require("./db/db.js");
const methodOverride = require("method-override");
const listingRoute = require("./routes/listingRouter.js");
const reviewRoute = require("./routes/reviewRouter.js");
const userRoute = require("./routes/userRouter.js")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User = require("./model/user.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
connectDB();
const store = MongoStore.create({
  mongoUrl:process.env.MONGO_URI,
  crypto:{
    secret:process.env.APP_SECRET
  },
  touchAfter:24*3600
});
store.on("error",()=>{
  console.log(err);
  
})
const sessionOptions ={
  store:store, // store same so also we use one
  secret:process.env.APP_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
  
}
app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
 res.locals.success= req.flash("success");
 res.locals.error=req.flash("error")
 res.locals.currUser=req.user;
 
  next();
})
app.get("/",(req,res)=>{
  res.redirect("/listings");
})
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/",userRoute);
// 404 page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found..."));
});
// error route
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
  // res.status(statusCode).send(message);
});
app.listen(3000, (req, res) => {
  console.log(`server is listing on port ${3000}`);
});
