import userControl from '../controllers/user.controller';
import { adminAccess, authorization } from '../controllers/auth.controller';

const userRoute = (router) => {
  router
    .route('/users')
    .post(userControl.signup);

  router
    .route('/users/login')
    .post(userControl.login);

  router
    .route('/users')
    .get(authorization, adminAccess, userControl.getAll);

  router
    .route('/users/:id')
    .get(authorization, adminAccess, userControl.find)
    .put(authorization, userControl.update)
    .delete(authorization, adminAccess, userControl.delete);

  router
    .route('/users/:id/documents')
    .get(authorization, userControl.documents);
};

export default userRoute;
