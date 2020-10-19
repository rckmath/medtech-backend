import AWS from 'aws-sdk';
import httpStatus from 'http-status';
import dayjs from 'dayjs';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enums/error-type';
import Constants from '../utils/constants';

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: Constants.aws.accessKey,
  secretAccessKey: Constants.aws.secretAccessKey,
  region: Constants.aws.region,
});

export default class S3Amazon {
  static async uploadBuffer(bucket, file, options) {
    let response = null;

    try {
      const [, extension] = options.contentType.split('/');

      const uploadParams = {
        Key: `${file.id}.${extension}`,
        Body: file.buffer,
        Bucket: bucket,
        Expires: options.expiresAt,
        ContentType: options.contentType,
      };

      await S3.upload(uploadParams).promise();

      const getParams = {
        Key: `${file.id}.${extension}`,
        Bucket: bucket,
        Expires: dayjs(options.expiresAt).diff(dayjs(), 's'),
      };

      response = await S3.getSignedUrlPromise('getObject', getParams);
    } catch (err) {
      throw new ExtendableError(ErrorType.AWS, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }

  static async getFile(bucket, fileName, options) {
    let response = null;

    try {
      const [, extension] = options.contentType.split('/');

      const getParams = {
        Key: fileName,
        Bucket: bucket,
      };

      response = await S3.getObject('getObject', getParams).promise();
    } catch (err) {
      throw new ExtendableError(ErrorType.AWS, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }
}
