import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
import userSeed from '../user.seed';
import app from '../../app';
import User from '../../app/models/user.model';
import Document from '../../app/models/document.model';

const server = supertest(app);
const secret = process.env.SECRET;
const adminToken = jwt.sign({ username: userSeed[0].username, role: userSeed[0].role, id: 1 }, secret);
const userToken = jwt.sign({ username: userSeed[1].username, role: userSeed[1].role, id: 2 }, secret);
const diffToken = jwt.sign({ username: userSeed[7].username, role: userSeed[7].role, id: 4 }, secret);

before((done) => {
    server
      .post('/api/users')
      .send(userSeed[0])
      .end((err, res) => {
          done();
      });
});

describe('User', () => {
  it('should validate that a new user is unique', (done) => {
      server
        .post('/api/users')
        .send(userSeed[0])
        .end((err, res) => {
            res.status.should.equal(409);
            res.body.message.should.equal('This user already exists.');
            done();
        });
  });

  it('should validate that a new user is created', (done) => {
      server
        .post('/api/users')
        .send(userSeed[7])
        .end((err, res) => {
            res.status.should.equal(201);
            res.body.message.should.equal('Successfully registered');
            done();
        });
  });

  it('should validate that a new user has both first and last names', (done) => {
      server
        .post('/api/users')
        .send(userSeed[3])
        .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('Fill in the required fields');
            done();
        });
  });

  it('should return success if login is successful', (done) => {
      server
        .post('/api/users/login')
        .send(userSeed[4])
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('Successfully logged In');
            done();
        })
  });

  it('should return error if login password is wrong', (done) => {
      server
        .post('/api/users/login')
        .send(userSeed[5])
        .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Authenication failed. Username or password is incorrect');
            done();
        })
  });

  it('should return error if login user not found', (done) => {
      server
        .post('/api/users/login')
        .send(userSeed[6])
        .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Authenication failed. Username or password is incorrect');
            done();
        })
  });

  it('should return error if login details is not sent', (done) => {
      server
        .post('/api/users/login')
        .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('Fill in the required fields');
            done();
        })
  });

  it('should validate that only admins get to request all users', (done) => {
      server
        .get('/api/users')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.length.should.be.above(0);
            done();
        });
  });

  it('should return user not found if user is not found', (done) => {
      const userId = userSeed.length + 15;
      server
        .get('/api/users/'+ userId)
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('User not found.');
            done();
        })
  });

  it('should return a user when user id is sent', (done) => {
      server
        .get('/api/users/2')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.have.key('password');
            done();
        })
  });

  it('should return user details if regular token is sent', (done) => {
      server
        .get('/api/users/2')
        .set('authorization', userToken)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.not.have.key('password');
            done();
        });
  })
  it('should return err if not user', (done) => {
      server
        .put('/api/users/2')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('You can only access your account');
            done();
        })
  });

  it('should return success if user\'s attributes is updated', (done) => {
      server
        .put('/api/users/2')
        .set('authorization', userToken)
        .send({ "firstName": 'John'})
        .end((err, res) => {
            res.body.message.should.equal('Successfully Updated');
            done();
        })
  });

  it('should return err if user not found', (done) => {
      server
        .delete('/api/users/10')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('User not found.');
            done();
        })
  });

  it('should return success if user is deleted', (done) => {
      server
        .delete('/api/users/1')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.message.should.equal('Successfully Deleted.');
            done();
        });
  });

  it('should return all documents that belongs to the user', (done) => {
      server
        .get('/api/users/2/documents')
        .set('authorization', userToken)
        .end((err, res) => {
            res.status.should.equal(200);
            User
              .find({ where: { id: 2 } })
              .then((result) => {
                  Document
                    .findAll({ where: { owner: result.username } })
                    .then((doc) => {
                        doc.length.should.equal(res.body.length);
                    });
              });
            done();
        });
  });

  it('should return err if correct user id is not found for user docs', (done) => {
      server
        .get('/api/users/10/documents')
        .set('authorization', userToken)
        .end((err, res) => {
            res.status.should.equal(404);
            res.body.message.should.equal('User not found');
            done();
        });
  });

  it('should return all documents for the user if admin', (done) => {
      server
        .get('/api/users/2/documents')
        .set('authorization', adminToken)
        .end((err, res) => {
            res.status.should.equal(200);
             User
              .find({ where: { id: 2 } })
              .then((result) => {
                  Document
                    .findAll({ where: { owner: result.username } })
                    .then((doc) => {
                        doc.length.should.equal(res.body.length);
                    });
              });
            done();
        });
  });

  it('should return all documents if regular user queries for documents', (done) => {
      server
        .get('/api/users/2/documents')
        .set('authorization', diffToken)
        .end((err, res) => {
            res.status.should.equal(200);
             User
              .find({ where: { id: 2 } })
              .then((result) => {
                  Document
                    .findAll({ where: { owner: result.username } })
                    .then((doc) => {
                        doc.length.should.equal(res.body.length);
                    });
              });
            done();
        });
  })
});

it('should return user not found when doing an update', (done) => {
    server
      .put('/api/users/200')
      .set('authorization', userToken)
      .end((err, res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('User not found.');
          done();
      });
})
