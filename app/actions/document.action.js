import Document from '../models/document.model';


export default function CREATE(req, res) {
  const body = req.body;
  if (body.title && body.owner && body.content) {
    Document
     .findOne({
       where: {
         title: body.title,
       },
     })
     .then(() => res.status(409).json({
       status: 409,
       message: 'The document already exists.',
     }));

    Document
      .create(body)
      .then(() => res.status(201).json({
        status: 201,
        message: 'Document created',
      }))
      .catch(() => res.status(500).json({
        status: 500,
        message: 'There was as error saving your file',
      }));
  }
  return res.status(400).json({
    status: 400,
    message: 'Fill the required fields',
  });
}
