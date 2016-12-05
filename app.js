import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(morgan('dev'));
app.listen(port);
console.log(`App Listening to ${port}`);


export default app;
