import userControl from '../controllers/user.controller';
import { authenicate, authorization } from '../controllers/auth.controller';

const userRoute = (router) => {
  router
    .route('/users')
    .post(userControl.signup);

  router
    .route('/users/login')
    .post(userControl.login);

  router
    .route('/users')
    .get(authorization, authenicate, userControl.getAll);

  router
    .route('/users/:id')
    .get(authorization, authenicate, userControl.find)
    .put(authorization, userControl.update)
    .delete(authorization, authenicate, userControl.delete);
};

export default userRoute;
