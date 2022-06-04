/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @class Util
 * @classdesc
 */
export default class Util {
  /**
   * @static
   * @description
   * @param {*} requestObject
   */
  static async MakeHTTPRequest(requestObject) {
    const { method, url, params, data, headers } = requestObject;

    try {
      const response = await axios({
        method,
        url,
        params,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @static
   * @description
   * @param {Number} current
   * @param {Number} maxpage
   */
  static getPagination(current, maxpage) {
    const keys = [];

    if (current > 1) keys.push({ text: `«1`, callback_data: '1' });
    if (current > 2) keys.push({ text: `‹${current - 1}`, callback_data: (current - 1).toString() });

    keys.push({ text: `-${current}-`, callback_data: current.toString() });
    if (current < maxpage - 1) keys.push({ text: `${current + 1}›`, callback_data: (current + 1).toString() });
    if (current < maxpage) keys.push({ text: `${maxpage}»`, callback_data: maxpage.toString() });

    return { reply_markup: JSON.stringify({ inline_keyboard: [keys] }) };
  }
}
