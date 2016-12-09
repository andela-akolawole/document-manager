import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
import userSeed from '../user.seed';
import app from '../../app';

const server = supertest(app);
const secret = process.env.SECRET;
const adminToken = jwt.sign({ username: userSeed[0].username, role: userSeed[0].role }, secret);
const userToken = jwt.sign({ username: userSeed[1].username, role: userSeed[1].role }, secret);

before((done) => {
    server
      .post('/api/users/signup')
      .send(userSeed[0])
      .expect(400)
      .end((err, res) => {
          done();
      });
});

describe('User', () => {
  it('should validate that a new user is unique', (done) => {
      server
        .post('/api/users/signup')
        .send(userSeed[0])
        .expect(409)
        .end((err, res) => {
            res.status.should.equal(409);
            res.body.message.should.equal('This user already exists.');
            done();
        });
  });

  it('should validate that a new user has a role defined', (done) => {
      server
        .post('/api/users/signup')
        .send(userSeed[2])
        .expect(400)
        .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('Fill in the required fields');
            done();
        });
  });

  it('should validate that a new user has both first and last names', (done) => {
      server
        .post('/api/users/signup')
        .send(userSeed[3])
        .expect(400)
        .end((err, res) => {
            res.status.should.equal(400);
            res.body.message.should.equal('Fill in the required fields');
            done();
        });
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
  })
})
