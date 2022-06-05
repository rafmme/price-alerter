import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import sendmail from 'sendmail';
import Util from '../utils';
import RequestBuilder from '../utils/request/requestQueryBuilder';

dotenv.config();

/**
 * @class
 * @classdesc
 */
export default class Mailer {
  /**
   * @constructor
   * @description
   */
  constructor() {
    if (typeof Mailer.instance === 'object') {
      return Mailer.instance;
    }

    this.sendmail = sendmail;
    Mailer.instance = this;
    return this;
  }

  /**
   * @static
   * @description
   */
  static GetInstance() {
    const mailer = new this();
    return mailer;
  }

  /**
   * @static
   * @description
   * @param {Object} chatId
   */
  static sendMail({ from, to, subject, text, html }) {
    this.GetInstance().sendmail(
      {
        from,
        to,
        subject,
        text,
        html,
      },
      (err, resp) => {
        if (err) console.log(err && err.stack);
        console.dir(resp);
      },
    );
  }
}
