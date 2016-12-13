import Document from '../models/document.model';

/**
 * CREATE
 * @summary This creates a new document
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function CREATE(req, res) {
  const body = req.body;
  body.owner = req.decoded.username;
  if (body.title && body.owner && body.content && body.role && body.type) {
    Document
     .findOne({
       where: {
         title: body.title,
       },
     })
     .then((doc) => {
       if (doc) {
         return res.status(409).json({
           status: 409,
           message: 'The document already exists.',
         });
       } else {
         Document
           .create(body)
            .then(() => res.status(201).json({
              status: 201,
              message: 'Document created',
            }));
       }
     });
  } else {
    return res.status(400).json({
      status: 400,
      message: 'Fill the required fields',
    });
  }
}

/**
 * GETALL
 * @summary This returns all documents
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function GETALL(req, res) {
  const filter = {};
  filter.order = '"createdAt" DESC';
  if (req.query.date) {
    filter.where = {
      createdAt: req.query.date,
    };
  }
  if (req.query.limit) filter.limit = req.query.limit;
  if (req.query.page) filter.offset = (req.query.page - 1) * 10;
  Document
    .findAll(filter)
    .then((documents) => {
      if (req.decoded.role === 'regular' || req.query.role && req.query.role !== 'admin') {
        const docs = documents.filter((document) => {
          const docArr = [];
          if (document.owner === req.decoded.username && document.type === 'public') {
            return docArr.push(document);
          }
          if (document.owner === req.decoded.username && document.type === 'private') {
            return docArr.push(document);
          }
          if (document.owner !== req.decoded.username && document.type === 'public') {
            return docArr.push(document);
          }
        });

        return res.status(200).json(docs);
      }
      if (req.decoded.role === 'admin') {
        return res.status(200).json(documents);
      }
      return res.status(509).json({
        status: 509,
        message: 'Server error',
      });
    });
}

/**
 * GETBYID
 * @summary This returns a document based on its ID
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function GETBYID(req, res) {
  Document
    .findById(req.params.id)
    .then((document) => {
      return res.status(200).json([document]);
    });
}

/** UPDATE
 * @summary This updates a document attributes
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function UPDATE(req, res) {
  const body = req.body;
  const filter = {};
  filter.where = { id: req.params.id };
  Document
    .findOne(filter)
    .then((document) => {
      if (!document) {
        return res.status(400).json({
          status: 400,
          message: 'Document not found',
        });
      }
      if (document.owner !== req.decoded.username) {
        return res.status(401).json({
          status: 401,
          message: 'You can only edit your own document',
        });
      }
      document
        .update(body, filter)
        .then(() => {
          return res.status(200).json({
            status: 200,
            message: 'Successfully updated',
          });
        });
    });
}

/**
 * DELETE
 * @summary This deletes a document
 * @param {object} req
 * @param {object} res
 * @return {object}
 */
export function DELETE(req, res) {
  const filter = {};
  filter.where = { id: req.params.id };
  Document
    .findOne(filter)
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          status: 404,
          message: 'Document not found',
        });
      }
      document
        .destroy(filter)
        .then(() => {
          return res.status(200).json({
            status: 200,
            message: 'Successfully deleted',
          });
        });
    });
}
