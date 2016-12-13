import documentControl from '../controllers/document.controller';
import { adminAccess, authorization } from '../controllers/auth.controller';

const documentRoute = (router) => {
  router
    .route('/documents')
    .post(authorization, documentControl.createNew)
    .get(authorization, documentControl.getAll);

  router
    .route('/documents/:id')
    .get(authorization, documentControl.getById)
    .put(authorization, documentControl.update)
    .delete(authorization, adminAccess, documentControl.delete);
};

export default documentRoute;
