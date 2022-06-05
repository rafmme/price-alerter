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
   * @param {Function} sendMessageHandler
   * @param {Function} onTextHandler
   */
  static onStart(sendMessageHandler, onTextHandler) {
    const re = /^\/start$/;

    onTextHandler(re, async (msg) => {
      const telegramId = msg.from.id;
      const chatId = msg.chat.id;
      const name = `${msg.from.first_name}`;
      const msgOptions = {
        reply_to_message_id: msg.message_id,
      };

      if (
        (await UsersService.findOne({
          where: {
            telegramId,
          },
        })) === null
      ) {
        await UsersService.create({ name, telegramId });
        return sendMessageHandler(chatId, constants.newUserStartText(name), msgOptions);
      }

      return sendMessageHandler(chatId, constants.oldUserStartText(name), msgOptions);
    });
  }

  static execute(sendMessageHandler, onTextHandler, handleCallbackQuery) {
    this.onStart(sendMessageHandler, onTextHandler);
  }
}
