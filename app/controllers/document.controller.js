import { CREATE, GETALL, GETBYID, UPDATE, DELETE } from '../actions/document.action';

const documentControl = {
  createNew: CREATE,
  getAll: GETALL,
  getById: GETBYID,
  update: UPDATE,
  delete: DELETE,
};

export default documentControl;

