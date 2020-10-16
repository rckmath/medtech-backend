import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import MailService from './services/mailing';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const send = async () => MailService.sendRecoveryMail({ email: 'ericklopes02@gmail.com', name: 'Erick' }, 30000);

send().catch((err) => console.error(err));
