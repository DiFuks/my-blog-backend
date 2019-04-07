import * as passport from 'passport';

import jwt from '@passport/Jwt';
import { AuthTypes } from '@enum/AuthTypes';

passport.use(AuthTypes.JWT, jwt);

export { passport };
