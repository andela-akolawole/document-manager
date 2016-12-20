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
    .find({
      where: {
        roleTitle: body.roleTitle,
      },
    })
    .then((role) => {
      if (role) {
        return res.status(409).json({
          status: 409,
          message: 'This role already exists',
        });
      }
      Role
      .create(body)
      .then(() => {
        return res.status(200).json({
          status: 200,
          message: 'Successfully created',
        });
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
