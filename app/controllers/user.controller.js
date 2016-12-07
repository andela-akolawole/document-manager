import { CREATE, LOGIN, GET_ALL } from '../actions/user.action';

const userControl = {
  signup: CREATE,
  login: LOGIN,
  getAll: GET_ALL,
};

export default userControl;
