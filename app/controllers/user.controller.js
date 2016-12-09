import { CREATE, LOGIN, GET_ALL, FIND, UPDATE, DELETE } from '../actions/user.action';

const userControl = {
  signup: CREATE,
  login: LOGIN,
  getAll: GET_ALL,
  find: FIND,
  update: UPDATE,
  delete: DELETE,
};

export default userControl;
