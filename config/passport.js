const passport = require('passport');
const GitHubStrategy = require('passport-github2')
   .Strategy;

passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
   },
   (accessToken, refreshToken, profile, done) => {
      User.findOrCreate({
         githubId: profile.id
      }, (err, user) => {
         return done(err, user);
      });
   }
));
