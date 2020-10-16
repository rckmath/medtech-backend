import crypto from 'crypto';
import dayjs from 'dayjs';

export function stringReplace(base, params) {
  Object.keys(params).forEach((opt) => {
    base = base.replace(new RegExp(`\\{${opt}\\}`, 'g'), params[opt]);
  });

  return base;
}

export function sha256(stringToHash) {
  return crypto.createHash('sha256')
    .update(stringToHash)
    .digest('hex');
}

export function msToTime(s) {
  return dayjs(s).format('HH:mm:ss');
}

export function controllerPaginationHelper(req) {
  return {
    offset: req.query.offset ? (req.query.offset * (req.query.limit || 10)) : 0,
    orderBy: req.query.orderBy && req.query.orderBy.split('.'),
    isDESC: req.query.isDESC === 'true',
    limit: req.query.limit || 10,
  };
}

export function serviceOrderHelper(searchParameter) {
  const order = (searchParameter.orderBy ? searchParameter.orderBy : ['createdAt']);

  order.push(
    searchParameter.isDESC ? 'DESC' : 'ASC',
  );
  return order;
}
