import dayjs from 'dayjs';

export function stringTrim(searchParameter, attrName, attrValue) {
  if (attrName && attrValue && attrValue.trim().length > 0) {
    searchParameter[`${attrName}`] = attrValue.trim();
  }

  return searchParameter;
}

export function createDtRangeSearch(searchParameter, attrName, attrValue) {
  if (attrName && attrValue) {
    const [startAt, endAt] = attrValue.split(',');

    searchParameter[`${attrName}`] = {
      startAt: (startAt && dayjs(startAt).isValid()) && dayjs(startAt).format(),
      endAt: (endAt && dayjs(endAt).isValid()) && dayjs(endAt).format(),
    };
  }

  return searchParameter;
}
