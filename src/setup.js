import moment from 'moment-timezone';
import Constants from './utilities/constants';

moment.tz.setDefault(Constants.timezone);
moment.locale(Constants.language);
