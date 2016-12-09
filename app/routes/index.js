import userRoutes from './user.route';
import roleRoutes from './role.route';

const routes = (router) => {
  userRoutes(router);
  roleRoutes(router);
};

export default routes;
