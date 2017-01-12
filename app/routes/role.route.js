import roleControl from '../controllers/role.controller';
import { adminAccess, authorization } from '../controllers/auth.controller';

const roleRoute = (router) => {
  router
    .route('/roles')
    .post(authorization, adminAccess, roleControl.create)
    .get(authorization, adminAccess, roleControl.getAll);
};

export default roleRoute;
