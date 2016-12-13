import userRoutes from './user.route';
import roleRoutes from './role.route';
import documentRoutes from './document.route';

const routes = (router) => {
  userRoutes(router);
  roleRoutes(router);
  documentRoutes(router);
};

export default routes;
