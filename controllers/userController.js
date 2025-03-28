
const User = require("../model/user.js")
module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs");}



    module.exports.signup =async (req, res) => {
        try {
          let { username, email, password } = req.body;
    
          let newUser = new User({ email, username });
          const registeredUser = await User.register(newUser, password);
          // console.log(registeredUser);
    
          req.login(registeredUser, (err) => {
            if (err) {
              return next(err);
            }
    
            req.flash("success", "Welcome to wunderlust");
            res.redirect("/listings");
          });
        } catch (error) {
          req.flash("error", error.message);
          res.redirect("/signup");
        }
      }

      module.exports.loginForm= (req, res) => {
        res.render("user/login.ejs");
      }


      module.exports.login=async (req, res) => {
        try {
          req.flash("success", "Welcome back to wunderlust...");
          let redirectUrl =  res.locals.redirectUrl || "/listings";
          res.redirect(redirectUrl);
        } catch (error) {
          req.flash("error", error.message);
          res.redirect("/login");
        }
      }

      module.exports.logout=(req, res, next) => {
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "User logout successfully");
          res.redirect("/listings");
        });
      }