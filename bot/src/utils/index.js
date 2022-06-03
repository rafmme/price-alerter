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
}
