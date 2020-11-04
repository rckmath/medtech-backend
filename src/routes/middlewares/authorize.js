import httpStatus from 'http-status';
import ErrorType from '../../enums/error-type';
import ExtendableError from '../../utils/error/extendable';
import { AuthCodeError } from '../../utils/error/business-errors';

export default function authorize(permissionList) {
  return (req, _res, next) => {
    const hasAccess = req.user && permissionList.find((o) => o === req.user.userType);

    try {
      if (!hasAccess) {
        throw new ExtendableError(ErrorType.FORBIDDEN, AuthCodeError.ACCESS_NOT_ALLOWED, httpStatus.FORBIDDEN);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}
