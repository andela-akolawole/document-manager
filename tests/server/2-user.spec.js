import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
import userSeed from '../user.seed';
import app from '../../app';

const server = supertest(app);
const secret = process.env.SECRET;
const adminToken = jwt.sign({ username: userSeed[0].username, role: userSeed[0].role, id: 1 }, secret);
const userToken = jwt.sign({ username: userSeed[1].username, role: userSeed[1].role, id: 2 }, secret);
const diffToken = jwt.sign({ username: userSeed[7].username, role: userSeed[7].role, id: 4 }, secret);

before((done) => {
    server
      .post('/api/users')
      .send(userSeed[0])
      .expect(400)
      .end((err, res) => {
          done();
      });
});

describe('User', () => {
  it('should validate that a new user is unique', (done) => {
      server
        .post('/api/users')
        .send(userSeed[0])
        .expect(409)
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
        .expect(201)
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
        .expect(400)
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
        .expect(200)
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
        .expect(403)
        .end((err, res) => {
            res.status.should.equal(403);
            res.body.message.should.equal('Authenication failed. Username or password! is incorrect');
            done();
        })
  });

  it('should return error if login user not found', (done) => {
      server
        .post('/api/users/login')
        .send(userSeed[6])
        .expect(401)
        .end((err, res) => {
            res.status.should.equal(401);
            res.body.message.should.equal('Authenication failed. Username or password is incorrect');
            done();
        })
  });

  it('should return error if login details is not sent', (done) => {
      server
        .post('/api/users/login')
        .expect(400)
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
        .expect(200)
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
        .expect(404)
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
        .expect(200)
        .end((err, res) => {
            res.status.should.equal(200);
            done();
        })
  });

  it('should return err if not user', (done) => {
      server
        .put('/api/users/2')
        .set('authorization', adminToken)
        .expect(401)
        .end((err, res) => {
            res.status.should.equal(401);
            res.body.message.should.equal('You can only access your account');
            done();
        })
  });

  it('should return success if user attributes is updated', (done) => {
      server
        .put('/api/users/2')
        .set('authorization', userToken)
        .send({ "firstName": 'John'})
        .expect(200)
        .end((err, res) => {
            res.body.message.should.equal('Successfully Updated');
            done();
        })
  });

  it('should return err if user not found', (done) => {
      server
        .delete('/api/users/10')
        .set('authorization', adminToken)
        .expect(404)
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
        .expect(200)
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
        .expect(200)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.length.should.be.above(1);
            done();
        });
  });

  it('should return err if correct user id is not found for user docs', (done) => {
      server
        .get('/api/users/10/documents')
        .set('authorization', userToken)
        .expect(404)
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
        .expect(200)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.length.should.be.above(1);
            done();
        });
  });

  it('should return all documents if regular user queries for documents', (done) => {
      server
        .get('/api/users/2/documents')
        .set('authorization', diffToken)
        .expect(200)
        .end((err, res) => {
            res.status.should.equal(200);
            res.body.length.should.be.above(0);
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
