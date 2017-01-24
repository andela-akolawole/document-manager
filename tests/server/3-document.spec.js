import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
import Document from '../../app/models/document.model';
import userSeed from '../user.seed';
import documentSeed from '../document.seed';
import app from '../../app';

const server = supertest(app);
const secret = process.env.SECRET;
const adminToken = jwt.sign({ username: userSeed[0].username, role: userSeed[0].role, id: 1 }, secret);
const userToken = jwt.sign({ username: userSeed[1].username, role: userSeed[1].role, id: 2 }, secret);
const wrongToken = jwt.sign({ username: userSeed[2].username, role: 'document', id: 3 }, secret);

describe('Document', () => {
    it('should return success if document is created', (done) => {
        server
          .post('/api/documents')
          .send(documentSeed[0])
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(201);
              res.body.message.should.equal('Document created');
              done();
          });
    });

    it('should return error if all fields are not set',  (done) => {
        server
          .post('/api/documents')
          .send(documentSeed[2])
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(400);
              res.body.message.should.equal('Fill the required fields');
              done();
          });
    });

    it('should return error if doc already exists',  (done) => {
        server
          .post('/api/documents')
          .send(documentSeed[0])
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(409);
              res.body.message.should.equal('The document already exists.');
              done();
          });
    });

    it('should return all documents if admin', (done) => {
        server
          .get('/api/documents')
          .set('authorization', adminToken)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.length.should.be.equal(3);
              done();
          });
    });

    it('should return a limited set of details when limit query is used', (done) => {
        server
          .get('/api/documents?limit=2')
          .set('authorization', adminToken)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.length.should.equal(2);
              done();
          });
    });

    it('should return err if wrongtoken is used for accessing all documents', (done) => {
        server
           .get('/api/documents')
           .set('authorization', wrongToken)
           .end((err, res) => {
               res.status.should.equal(400);
               res.body.message.should.equal('Authentication failed: You are not a valid user');
               done();
           });
    })

    it('should return a paginated result if page query is used', (done) => {
        server
          .get('/api/documents?page=1')
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.containDeep([{type: 'public'}], [{owner: userSeed[1].username },{type: 'private'}]);
              res.body.length.should.be.above(2);
              done();
          });
    });

    it('should return based on date created', (done) => {
        server
          .get('/api/documents')
          .set('authorization', adminToken)
          .end((err, res) => {
              const date = res.body[0].createdAt;
              server
                .get('/api/documents?date='+ date)
                .set('authorization', adminToken)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body[0].createdAt.should.equal(date);
                    res.body.length.should.be.equal(1);
                    done();
                });
          });
    });

    it('should return a document if queried by its ID', (done) => {
      server
        .get('/api/documents/5')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(200)
            res.body[0].id.should.equal(5);
            res.body.length.should.equal(1);
            done();
        });
    });

    it('should return a 404 error if document is private', (done) => {
        server
        .get('/api/documents/4')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(404)
            res.body.message.should.equal('Document not found');
            done();
        });
    })

    it('should return success if document is updated', (done) => {
        server
          .put('/api/documents/3')
          .send({ title: 'Choose one' })
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.message.should.equal('Successfully updated');
              done();
          });
    });

    it('should return err if document is not found', (done) => {
        server
          .put('/api/documents/10')
          .send({ title: 'Wrong ways'})
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('Document not found');
              done();
          });
    });

    it('should return err if document is not owned by logged in user', (done) => {
        server
          .put('/api/documents/3')
          .send({ title: 'Message us' })
          .set('authorization', adminToken)
          .end((err, res) => {
              res.status.should.equal(403);
              res.body.message.should.equal('You can only edit your own document');
              done();
          });
    });

    it('should return success if document is deleted', (done) => {
        server
          .delete('/api/documents/4')
          .set('authorization', adminToken)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.message.should.equal('Successfully deleted');
              done();
          });
    });

    it('should return err if document is not found when doing delete', (done) => {
        server
          .delete('/api/documents/10')
          .set('authorization', adminToken)
          .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('Document not found');
              done();
          });
    });
    
    it('should return all regular documents if role=regular query is used', (done) => {
        server
          .get('/api/documents?role=regular')
          .set('authorization', userToken)
          .end((err, res) => {
              res.status.should.equal(200);
              for(let i = 0; i < res.body.length; i++) {
                res.body[i].should.have.value('role', 'regular');
              }
              done();
          });
    });
});
