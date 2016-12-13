import roleControl from '../controllers/role.controller';
import { adminAccess, authorization } from '../controllers/auth.controller';

const roleRoute = (router) => {
  router
    .route('/roles/create')
    .post(authorization, adminAccess, roleControl.create);

  router
    .route('/roles')
    .get(authorization, adminAccess, roleControl.getAll);
};

export default roleRoute;
