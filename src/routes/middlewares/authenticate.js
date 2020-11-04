import httpStatus from 'http-status';
import ExtendableError from '../../utils/error/extendable';
import { AuthCodeError } from '../../utils/error/business-errors';
import AuthService from '../../services/auth';
import ErrorType from '../../enums/error-type';

const throwError = () => {
  throw new ExtendableError(
    ErrorType.UNAUTHORIZED, AuthCodeError.AUTHENTICATION_FAILED, httpStatus.UNAUTHORIZED,
  );
};

export default async function authenticate(req, _res, next) {
  try {
    if (!req.headers || !req.headers.authorization) { throwError(); }

    const [bearer, token] = req.headers.authorization.split(' ');

    if (!/^Bearer$/i.test(bearer)) { throwError(); }

    const response = await AuthService.authenticate(token);

    if (!response && (!response.token || !response.user)) { throwError(); }

    req.user = response.user;

    return next();
  } catch (err) {
    return next(err);
  }
}
