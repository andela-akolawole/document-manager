import jwt from 'jsonwebtoken';

/**
 * authorization
 * @summary This checks if user has a token to access certain route
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @return {Object}
 */
export function authorization(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: 'Failed to authenicate token',
        });
      }
      req.decoded = decoded;
      return next();
    });
  } else {
    return res.status(401).json({
      status: 401,
      message: 'You do not have an access token',
    });
  }
  return null;
}

/**
 * adminAccess
 * @summary This checks if the user accessing the route
 * is an admin
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @return {Object}
 */
export function adminAccess(req, res, next) {
  const role = req.decoded.role;
  if (role && role === 'admin') {
    return next();
  }
  return res.status(403).json({
    status: 403,
    message: 'You are not authorized to view this content',
  });
}
