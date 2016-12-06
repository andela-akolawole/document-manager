import userControl from '../controllers/user.controller';

const userRoute = (router) => {
  router
    .route('/users/signup')
    .post(userControl.signup);

  router
    .route('/users/login')
    .post(userControl.login);
};

export default userRoute;
