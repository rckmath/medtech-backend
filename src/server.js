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

app.use((_req, _res, next) => {
  const err = new Error('not_found');
  err.status = httpStatus.NOT_FOUND;
  next();
});

app.use((err, _req, res, next) => {
  if (err.errors && err.errors.length > 0) {
    const error = err.errors.pop();

    res.status(httpStatus.BAD_REQUEST).json({
      error: {
        type: 'client_error',
        message: error.msg,
        options: error.param,
        status: httpStatus.BAD_REQUEST,
      },
    });
  } else {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        type: err.type,
        message: err.message,
        status: err.status,
        stack: err.stack,
      },
    });

    next(err);
  }
});

export default app;
