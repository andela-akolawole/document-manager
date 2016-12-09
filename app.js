import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import routes from './app/routes/';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(morgan('dev'));


// router
routes(router);
app.use('/api', router);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Not found!!!!!!',
  });
  next();
});

app.listen(port);
console.log(`App Listening to ${port}`);


export default app;
