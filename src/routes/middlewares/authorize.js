import httpStatus from 'http-status';
import ErrorType from '../../enums/error-type';
import ExtendableError from '../../utils/error/extendable';

export default function authorize(permissionList) {
  return (req, _res, next) => {
    const hasAccess = req.user && permissionList.find((o) => o === req.user.userType);

    try {
      if (!hasAccess) {
        throw new ExtendableError(ErrorType.FORBIDDEN, 'Permission denied.', httpStatus.FORBIDDEN);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}
