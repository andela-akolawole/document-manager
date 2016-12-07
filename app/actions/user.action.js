import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

function verifyPassword(plainTextPassword, hashedPassword) {
  if (!plainTextPassword || !hashedPassword) return false;
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
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
      .then((document) => {
        if (!document) {
          User
            .create(body)
            .then((user) => {
              const token = jwt.sign({
                username: user.dataValues.username,
                role: user.dataValues.role,
              },
              process.env.SECRET);

              return res.status(201).json({
                status: 201,
                message: 'Successfully registration',
                token,
              });
            })
            .catch((err) => {
              if (err) {
                return res.json({
                  status: 500,
                  message: 'Unsuccessfull registration',
                });
              }
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
         if (!verifyPassword(body.password, user.password)) {
           return res.status(403).json({
             status: 403,
             message: 'Authenication failed. Username or password! is incorrect',
           });
         }
         const token = jwt.sign(user.username, process.env.SECRET);
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
 * @summary This return all registered users
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function GET_ALL(req, res) {
  User
    .findAll()
    .then(users => res.status(200).json(users));
}
