import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
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
          .expect(201)
          .end((err, res) => {
              res.status.should.equal(201);
              res.body.message.should.equal('Document created');
              done();
          });
    });

    it('should return error if all field are not set',  (done) => {
        server
          .post('/api/documents')
          .send(documentSeed[2])
          .set('authorization', userToken)
          .expect(400)
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
          .expect(409)
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
          .expect(200)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.length.should.be.above(3);
              done();
          });
    });

    it('should return a limited set of details when limit query is used', (done) => {
        server
          .get('/api/documents?limit=2')
          .set('authorization', adminToken)
          .expect(200)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.length.should.equal(2);
              done();
          });
    });

    it('should return err if user is not admin or regular', (done) => {
        server
           .get('/api/documents')
           .set('authorization', wrongToken)
           .expect(509)
           .end((err, res) => {
               res.status.should.equal(509);
               res.body.message.should.equal('Server error');
               done();
           });
    })

    it('should return a paginated result if page query is used', (done) => {
        server
          .get('/api/documents?page=1')
          .set('authorization', userToken)
          .expect(200)
          .end((err, res) => {
              res.status.should.equal(200);
              res.body.length.should.be.above(2);
              done();
          });
    });

    it('should return result if role query is used', (done) => {
        server
          .get('/api/documents?role=regular')
          .set('authorization', adminToken)
          .expect(200)
          .end((err, res) => {
              res.status.should.equal(200);
              done();
          });
    });

    it('should return based on date created', (done) => {
        server
          .get('/api/documents')
          .set('authorization', adminToken)
          .expect(200)
          .end((err, res) => {
              const date = res.body[0].createdAt;
              server
                .get('/api/documents?date='+ date)
                .set('authorization', adminToken)
                .expect(200)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.length.should.be.equal(1);
                    done();
                });
          });
    });

    it('should return a document if queried by its ID', (done) => {
      server
        .get('/api/documents/1')
        .set('authorization', adminToken)
        .expect(200)
        .end((err, res) => {
            res.status.should.equal(200)
            res.body.length.should.equal(1);
            done();
        });
    });

    it('should return success if document is updated', (done) => {
        server
          .put('/api/documents/3')
          .send({ title: 'Choose one' })
          .set('authorization', userToken)
          .expect(200)
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
          .expect(400)
          .end((err, res) => {
              res.status.should.equal(400);
              res.body.message.should.equal('Document not found');
              done();
          });
    });

    it('should return err if document is not owned by logged in user', (done) => {
        server
          .put('/api/documents/3')
          .send({ title: 'Message us' })
          .set('authorization', adminToken)
          .expect(401)
          .end((err, res) => {
              res.status.should.equal(401);
              res.body.message.should.equal('You can only edit your own document');
              done();
          });
    });

    it('should return success if document is deleted', (done) => {
        server
          .delete('/api/documents/3')
          .set('authorization', adminToken)
          .expect(200)
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
          .expect(404)
          .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('Document not found');
              done();
          });
    })
})