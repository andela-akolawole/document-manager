import userControl from '../controllers/user.controller';
import { authenicate, authorization } from '../controllers/auth.controller';

const userRoute = (router) => {
  router
    .route('/users/signup')
    .post(userControl.signup);

  router
    .route('/users/login')
    .post(userControl.login);
  router
    .route('/users')
    .get(authorization, authenicate, userControl.getAll);
};

export default userRoute;
