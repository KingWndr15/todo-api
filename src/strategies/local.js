const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../database/schema/User");
const { comparePassword } = require("../utils/helper.js");

passport.serializeUser((user, done) => {
    console.log("Serializing User...");
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser( async (id, done) => {
    console.log("Deserializing User...");
    console.log(id);  
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      console.log(user);
      done(null, user);
    } catch (err) {
      console.log(err);
      done(err, null);
    }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      //   console.log(email, password);
      try {
        if (!email || !password) {
          done(new Error("Bad Request. Missing credentials."), null);
        }
        const userDB = await User.findOne({ email });
        if (!userDB) {
          done(new Error("Email cannot be found."), null);
        }
        const passwordIsCorrect = comparePassword(password, userDB.password);
        if (passwordIsCorrect) {
            console.log("Authenticated successfully");
            
            done(null, userDB);
        } else {
            console.log("invalid authebtication");
            done(null, null);
        }
        console.log(userDB.password, password);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
