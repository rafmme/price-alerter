/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
import axios from 'axios';
import dotenv from 'dotenv';
import constants from '../telegram/constants';

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
  static getPagination(current, maxpage, msgId) {
    const keys = [];

    if (current > maxpage || current === 0)
      return {
        reply_markup: JSON.stringify({
          inline_keyboard: [[{ text: '-1-', callback_data: '1' }]],
        }),
      };

    if (current - 1 < maxpage && current !== 1 && current - 1 > 0)
      keys.push({
        text: `« prev (${current - 1})`,
        callback_data: (current - 1).toString(),
      });

    keys.push({
      text: `-${current}-`,
      callback_data: current.toString(),
    });

    if (current + 1 < maxpage || current + 1 === maxpage)
      keys.push({
        text: `(${current + 1}) next »`,
        callback_data: (current + 1).toString(),
      });

    return {
      reply_to_message_id: msgId,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [keys],
      }),
    };
  }

  static showProductsListText(title, productsList) {
    let productText = '';

    if (productsList.length < 1) {
      return 'No results!';
    }

    productsList.forEach((product) => {
      productText += constants.productText(product);
    });

    return constants.resultsText(title, productText);
  }

  static showProductInfotext({ name, price, url, info, imageUrl }) {
    return constants.productInfoText({ name, price, url, info, imageUrl });
  }

  /**
   *
   * @param {String} word
   */
  static createSearchUrl(word) {
    const termsArray = word.split('@');

    if (word.includes('@') && termsArray.length === 2)
      return {
        query: termsArray[0],
        price: termsArray[1],
      };

    return {
      query: word,
      price: '',
    };
  }

  static showUserAlertsText(title, listOfAlerts) {
    let alertsText = '';

    if (!listOfAlerts || listOfAlerts.length < 1) {
      return 'No alert found.';
    }

    listOfAlerts.forEach((alert) => {
      alertsText += constants.alertText(alert);
    });

    return constants.resultsText(title, alertsText);
  }
}
