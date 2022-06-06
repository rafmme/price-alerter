import UsersService from '../service/users.service';
import constants from './constants';

/**
 * @class
 * @classdesc
 */
export default class BotOps {
  /**
   * @static
   * @description
   * @param {Function} TelegramBotHandler
   */
  static onStart(TelegramBotHandler) {
    const re = /^\/start$/;

    TelegramBotHandler.onText(re, async (msg) => {
      const telegramId = msg.from.id;
      const chatId = msg.chat.id;
      const name = `${msg.from.first_name}`;
      const user = await UsersService.findOne({
        where: {
          telegramId,
        },
      });
      const msgOptions = {
        reply_to_message_id: msg.message_id,
      };

      if (!user) {
        await UsersService.create({ name, telegramId });
        TelegramBotHandler.sendMessage(chatId, constants.newUserStartText(name), msgOptions);
      } else {
        TelegramBotHandler.sendMessage(chatId, constants.oldUserStartText(name), msgOptions);
      }
    });
  }

  static execute(TelegramBotHandler) {
    this.onStart(TelegramBotHandler);
  }
}
