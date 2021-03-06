import jwt from 'jsonwebtoken';
import crypto from 'crypto-js';
import User from '../models/user.model';
import Document from '../models/document.model';

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
  if (body.firstName && body.lastName && body.username && body.email && body.password) {
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
                message: 'Successfully registered',
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
           return res.status(400).json({
             status: 400,
             message: 'Authenication failed. Username or password is incorrect',
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
       return res.status(400).json({
         status: 400,
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
 * @summary This returns a user
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
      if (req.decoded.role === 'admin') {
        return res.status(200).json(user);
      }
      return res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
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
  const filter = {};
  filter.where = { id: req.params.id };
  User
    .findOne(filter)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found.',
        });
      }
      if (user.id !== req.decoded.id) {
        return res.status(403).json({
          status: 403,
          message: 'You can only access your account',
        });
      }
      user
        .update(body, filter)
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
      return res.status(404).json({
        status: 404,
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

/**
 * DOCUMENTS
 * @summary This returns all documents for the user
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function DOCUMENTS(req, res) {
  const filter = {};

  filter.where = { id: req.params.id };
  User
    .findOne(filter)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
      Document
        .findAll({
          where: { owner: user.username },
        })
        .then((documents) => {
          if (user.username === req.decoded.username || req.decoded.role === 'admin') {
            return res.status(200).json(documents);
          }
          const docs = documents.filter((doc) => {
            const docArr = [];
            if (req.decoded.role !== 'admin' && doc.type === 'public') {
              return docArr.push(doc);
            }
          });
          return res.status(200).json(docs);
        });
    });
}
