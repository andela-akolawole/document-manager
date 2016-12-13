import jwt from 'jsonwebtoken';

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

export function adminAccess(req, res, next) {
  const role = req.decoded.role;
  if (role && role === 'admin') {
    return next();
  }
  return res.status(401).json({
    status: 401,
    message: 'You are not authorized to view this content',
  });
}
