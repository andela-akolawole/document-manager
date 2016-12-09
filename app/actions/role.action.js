import Role from '../models/role.model';

/**
 * CREATE
 * @summary This creates a unique role
 * @param {object} req
 * @param {object} res
 */
export function CREATE(req, res) {
  const body = req.body;
  if (!body.roleTitle) {
    return res.status(400).json({
      status: 400,
      message: 'Add a role.',
    });
  }
  Role
    .create(body)
    .then(() => {
      return res.status(200).json({
        status: 200,
        message: 'Successfully created',
      });
    })
    .catch(() => {
      return res.status(503).json({
        status: 503,
        message: 'Something went wrong.',
      });
    });
}

/**
 * GETALL
 * @summary This returns all the roles
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function GETALL(req, res) {
  Role
    .find()
    .then((role) => {
      return res.status(200).json(role);
    });
}
