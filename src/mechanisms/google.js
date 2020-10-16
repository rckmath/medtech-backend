import { google } from 'googleapis';

async function generateTokens(googleCredentials, redirectURL) {
  const { OAuth2 } = google.auth;
  const oAuth2Client = new OAuth2(googleCredentials.clientId, googleCredentials.clientSecret, redirectURL);

  await oAuth2Client.setCredentials({ refresh_token: googleCredentials.refreshToken });

  return oAuth2Client.getAccessToken();
}

export {
  // eslint-disable-next-line import/prefer-default-export
  generateTokens,
};
