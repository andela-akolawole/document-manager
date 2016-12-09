import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';
import User from '../models/user.model';

function verifyPassword(hashedPassword) {
  return crypto.AES.decrypt(hashedPassword, process.env.SECRET).toString(crypto.enc.Utf8);
}

/**
 * CREATE
 * @summary This creates a new user
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function CREATE(req, res) {
  const body = req.body;
  if (body.firstName && body.role && body.lastName && body.username && body.email && body.password) {
    User
      .findOne({
        where: {
          username: body.username,
        },
      })
      .then((users) => {
        if (!users) {
          User
            .create(body)
            .then((user) => {
              const token = jwt.sign({
                username: user.dataValues.username,
                role: user.dataValues.role,
                id: user.dataValues.id,
              },
              process.env.SECRET);

              return res.status(201).json({
                status: 201,
                message: 'Successfully registration',
                token,
              });
            });
        } else {
          return res.status(409).json({
            status: 409,
            message: 'This user already exists.',
          });
        }
      });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'Fill in the required fields',
    });
  }
}

/**
 * LOGIN
 * @summary This logs in a user with their registered
 * credentials
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function LOGIN(req, res) {
  const body = req.body;
  if (body.username && body.password) {
    User
     .findOne({
       where: {
         username: body.username,
       },
     })
     .then((user) => {
       if (user) {
         if (body.password !== verifyPassword(user.password)) {
           return res.status(403).json({
             status: 403,
             message: 'Authenication failed. Username or password! is incorrect',
           });
         }
         const token = jwt.sign({
           username: user.dataValues.username,
           role: user.dataValues.role,
           id: user.dataValues.id,
         }, process.env.SECRET);
         return res.status(200).json({
           status: 200,
           message: 'Successfully logged In',
           token,
         });
       }
       return res.status(403).json({
         status: 403,
         message: 'Authenication failed. Username or password is incorrect',
       });
     });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'Fill in the required fields',
    });
  }
}

/**
 * GET_ALL
 * @summary This returns all registered users
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function GET_ALL(req, res) {
  User
    .findAll()
    .then(users => res.status(200).json(users));
}

/**
 * FIND
 * @summary This returns all user
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function FIND(req, res) {
  User
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found.',
        });
      }
      return res.status(200).json(user);
    });
}

/**
 * UPDATE
 * @summary This update a user details
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function UPDATE(req, res) {
  const body = req.body;
  if (req.params.id !== req.decoded.id && req.decoded.role !== 'admin') {
    return res.status(401).json({
      status: 401,
      message: 'You can only access your account',
    });
  }
  User
  .findOne({
    where: {
      id: req.params.id,
    },
  })
  .then((user) => {
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found.',
      });
    }
    user
      .update(body, {
        where: {
          id: req.param.id,
        },
      })
      .then(() => {
        return res.status(200).json({
          status: 200,
          message: 'Successfully Updated',
        });
      });
  });
}

/**
 * DELETE
 * @summary This deletes a user
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function DELETE(req, res) {
  User
  .findOne({
    where: {
      id: req.params.id,
    },
  })
  .then((user) => {
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found.',
      });
    }
    user
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then(() => {
        return res.status(200).json({
          status: 200,
          message: 'Successfully Deleted.',
        });
      });
  });
}
