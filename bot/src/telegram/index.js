import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
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

  static handleCallbackQuery() {
    this.on('callback_query', (message) => {
      const bookPages = 100;
      const msg = message.message;
      const editOptions = {
        ...Util.getPagination(Number.parseInt(message.data, 10), bookPages),
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      };
      this.GetInstance().bot.editMessageText(`Page: ${message.data}`, editOptions);
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
