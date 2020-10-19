import Constants from '../../utils/constants';
import { generateTokens } from '../../mechanisms/google';

export default class GoogleAuthService {
  static async OAuth() {
    return generateTokens({
      clientId: Constants.google.clientId,
      clientSecret: Constants.google.clientSecret,
      refreshToken: Constants.google.clientRefreshToken,
    }, 'https://developers.google.com/oauthplayground');
  }
}
