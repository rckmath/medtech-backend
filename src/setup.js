import moment from 'moment-timezone';
import Constants from './utils/constants';

moment.tz.setDefault(Constants.timezone);
moment.locale(Constants.language);
