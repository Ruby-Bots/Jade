import passport from "passport";
import { Profile, Strategy } from "passport-discord";
import { VerifyCallback } from "passport-oauth2";
import UserMain, { User } from "../schemas/Collections/Users/UserMain";
import CryptoJS from "crypto-js";
import getAdminGuilds from "../backend/modules/getAdminGuilds";

passport.serializeUser((user: User, done) => {
  return done(null, user.userId);
});
passport.deserializeUser(async (id, done) => {
  const user = await UserMain.findOne({ userId: id });
  return user ? done(null, user) : done(null, null);
});

const strat = () => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.URL}/api/auth/callback`,
        scope: ["identify", "guilds"],
      },
      async (
        accessToken,
        refreshToken,
        profile: Profile,
        done: VerifyCallback
      ) => {
        let UserData = await UserMain.findOne({ userId: profile.id });
        if (!UserData) await UserMain.create({ userId: profile.id });
        const guilds = await getAdminGuilds(profile.guilds, profile.id);
        const cyrpytedToken = CryptoJS.AES.encrypt(
          accessToken,
          process.env.SECRET
        ).toString();

        await UserMain.findOneAndUpdate(
          { userId: profile.id },
          {
            token: cyrpytedToken,
            guilds: guilds,
            basicInformation: {
              username: profile.username,
              discrim: profile.discriminator,
              avatar_url: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=1024`,
            },
          }
        );
        UserData = await UserMain.findOne({ userId: profile.id });
        return done(null, UserData as User);
      }
    )
  );
};

export default new strat();
