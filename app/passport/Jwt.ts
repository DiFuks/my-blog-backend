import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { getRepository } from 'typeorm';

import { User } from '@entities/User';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

const jwt = new JWTStrategy(options, async (jwtPayload, done) => {
  try {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(jwtPayload.id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

export default jwt;
