import roleControl from '../controllers/role.controller';
import { authenicate, authorization } from '../controllers/auth.controller';

const roleRoute = (router) => {
  router
    .route('/roles/create')
    .post(authorization, authenicate, roleControl.create);

  router
    .route('/roles')
    .get(authorization, authenicate, roleControl.getAll);
};

export default roleRoute;
