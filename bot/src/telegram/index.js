import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import RedisCache from '../cache/redis';
import Util from '../utils';
import BotOps from './botOps';

dotenv.config();

/**
 * @class
 * @classdesc
 */
export default class TelegramBotHandler {
  /**
   * @constructor
   * @description
   */
  constructor() {
    const { TG_KEY } = process.env;
    const configOptions = {
      polling: true,
    };

    if (typeof TelegramBotHandler.instance === 'object') {
      return TelegramBotHandler.instance;
    }

    this.bot = new TelegramBot(TG_KEY, configOptions);
    TelegramBotHandler.instance = this;
    return this;
  }

  /**
   * @static
   * @description
   */
  static GetInstance() {
    const telegramBotHandler = new this();
    return telegramBotHandler;
  }

  /**
   * @static
   * @description
   * @param {String} chatId
   * @param {String} message
   * @param {Object} options
   * @returns {undefined}
   */
  static sendMessage(chatId, message, options) {
    this.GetInstance().bot.sendMessage(chatId, message, options);
  }

  /**
   * @static
   * @description
   * @param {RegExp} wordPattern
   * @param {Function} handler
   */
  static onText(wordPattern, handler) {
    this.GetInstance().bot.onText(wordPattern, handler);
  }

  /**
   * @static
   * @description
   * @param {String} event
   * @param {Function} handler
   */
  static on(event, handler) {
    this.GetInstance().bot.on(event, handler);
  }

  /**
   *
   * @param {Array} list
   * @param {Number} pages
   * @param {String} title
   */
  static handleCallbackQuery(list, pages, title) {
    if (list.length < 1) {
      return;
    }

    this.on('callback_query', async (message) => {
      const msg = message.message;
      const currentPage = message.data;
      const divider = 5;

      const cacheKey = await RedisCache.GetItem(`ls_s${msg.chat.id}`);
      const searchResultString = await RedisCache.GetItem(cacheKey);
      const userLastSearchResult = cacheKey && searchResultString ? JSON.parse(searchResultString) : [];
      const listOfProducts = list || userLastSearchResult.products;

      const contentsList = currentPage === 1 ? listOfProducts.slice(0, divider) : listOfProducts.slice(divider * (currentPage - 1), divider * currentPage);
      const text = Util.showProductsListText(title || `${userLastSearchResult.message}\n\nI found ${userLastSearchResult.count} item(s).`, contentsList);

      const editOptions = {
        ...Util.getPagination(Number.parseInt(currentPage, 10), pages, msg.message_id),
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      };

      this.GetInstance().bot.editMessageText(text, editOptions);
    });
  }

  /**
   * @static
   * @description
   */
  static async init() {
    BotOps.execute(this);
  }
}
