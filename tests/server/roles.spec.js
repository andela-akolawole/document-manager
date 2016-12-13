import supertest from 'supertest';
import should from 'should';
import jwt from 'jsonwebtoken';
import userSeed from '../user.seed';
import roleSeed from '../role.seed';
import app from '../../app';

const server = supertest(app);
const secret = process.env.SECRET;
const adminToken = jwt.sign({ username: userSeed[0].username, role: userSeed[0].role, id:'1' }, secret);
const userToken = jwt.sign({ username: userSeed[1].username, role: userSeed[1].role, id: '2' }, secret);
const wrongToken = 'wrong';

describe('Role', () => {
    it('should create a new role', (done) => {
        server
          .post('/api/roles/create')
          .send(roleSeed[0])
          .set('authorization', adminToken)
          .expect(200)
          .end((err, res) => {
             res.status.should.equal(200);
             res.body.message.should.equal('Successfully created');
             done();
          });
    });

    it('should return err if role title is not set', (done) => {
        server
          .post('/api/roles/create')
          .set('authorization', adminToken)
          .expect(400)
          .end((err, res) => {
             res.status.should.equal(400);
             res.body.message.should.equal('Add a role.');
             done();
          });
    });

    it('should return err if role is created twice', (done) => {
        server
          .post('/api/roles/create')
          .send(roleSeed[0])
          .set('authorization', adminToken)
          .expect(503)
          .end((err, res) => {
              res.status.should.equal(503);
              res.body.message.should.equal('Something went wrong.');
              done();
          });
    })

    it('should return all roles', (done) => {
        server
          .get('/api/roles')
          .set('authorization', adminToken)
          .expect(200)
          .end((err, res) => {
              res.status.should.equal(200);
              done();
          });
    });

    it('should return err if wrong route is sent', (done) => {
        server
          .post('/api/roles')
          .set('authorization', adminToken)
          .expect(404)
          .end((err, res) => {
              res.status.should.equal(404);
              res.body.message.should.equal('Not found!!!!!!');
              done();
          });
    });

    it('should return err if wrong token', (done) => {
        server
          .get('/api/roles')
          .set('authorization', wrongToken)
          .expect(401)
          .end((err, res) => {
              res.status.should.equal(401);
              res.body.message.should.equal('Failed to authenicate token');
              done();
          });
    });

    it('should return err if token is not passed', (done) => {
        server
          .get('/api/roles')
          .expect(401)
          .end((err, res) => {
              res.status.should.equal(401);
              res.body.message.should.equal('You do not have an access token');
              done();
          });
    });

    it('should return err if not authorized', (done) => {
        server
          .get('/api/roles')
          .set('authorization', userToken)
          .expect(401)
          .end((err, res) => {
              res.status.should.equal(401);
              res.body.message.should.equal('You are not authorized to view this content');
              done();
          });   
    });
})