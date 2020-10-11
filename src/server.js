import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import httpStatus from 'http-status';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

app.use('/api', routes);

app.use((req, res, next) => {
  const err = new Error('Not found! Please check the URL.');
  err.status = httpStatus.NOT_FOUND;
  next();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);

  res.json({
    error: {
      message: err.message,
      status: err.status,
    },
  });

  next(err);
});

export default app;
