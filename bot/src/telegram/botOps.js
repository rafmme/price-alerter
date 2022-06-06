import RedisCache from '../cache/redis';
import SearchService from '../service/search.service';
import UsersService from '../service/users.service';
import Util from '../utils';
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
        parse_mode: 'Markdown',
      };

      if (!user) {
        await UsersService.create({ name, telegramId });
        TelegramBotHandler.sendMessage(chatId, constants.newUserStartText(name), msgOptions);
      } else {
        TelegramBotHandler.sendMessage(chatId, constants.oldUserStartText(name), msgOptions);
      }
    });
  }

  /**
   * @static
   * @description
   * @param {Function} TelegramBotHandler
   */
  static onBotCommands(TelegramBotHandler) {
    TelegramBotHandler.onText(/^\/help$/, async (msg) => {
      const chatId = msg.chat.id;
      TelegramBotHandler.sendMessage(chatId, constants.helpText, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      });
    });

    TelegramBotHandler.onText(/^\/search$/, async (msg) => {
      const chatId = msg.chat.id;
      await RedisCache.SetItem(chatId, 'SEARCH', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the Product name within the next 5 minutes.\nFor example: `Nokia Phone`\nTo specify price range, send `Nokia Phone@20,000-70,000`',
      );
    });

    TelegramBotHandler.onText(/^\/setalert$/, async (msg) => {
      const chatId = msg.chat.id;
      await RedisCache.SetItem(chatId, 'SET_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the Alert details within the next 5 minutes.\nFor example: `Nokia Phone@20,000-70,000`\ni.e Name of Product@Price-Range',
      );
    });
    TelegramBotHandler.onText(/^\/stopalert$/, async (msg) => {
      const chatId = msg.chat.id;
      await RedisCache.SetItem(chatId, 'STOP_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(chatId, 'Please enter the Alert ID within the next 5 minutes.\nFor example: `02334`');
    });
    TelegramBotHandler.onText(/^\/startalert$/, async (msg) => {
      const chatId = msg.chat.id;
      await RedisCache.SetItem(chatId, 'START_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(chatId, 'Please enter the Alert ID within the next 5 minutes.\nFor example: `02334`');
    });
    TelegramBotHandler.onText(/^\/deletealert$/, async (msg) => {
      const chatId = msg.chat.id;
      await RedisCache.SetItem(chatId, 'DELETE_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(chatId, 'Please enter the Alert ID within the next 5 minutes.\nFor example: `02334`');
    });
    TelegramBotHandler.onText(/^\/viewalerts$/, async (msg) => {
      const chatId = msg.chat.id;
      TelegramBotHandler.sendMessage(chatId, 'All alerts');
    });
  }

  /**
   * @static
   * @description
   * @param {Function} TelegramBotHandler
   */
  static onUserInput(TelegramBotHandler) {
    const re = /(?:)/;

    TelegramBotHandler.onText(re, async (msg) => {
      if (
        msg.text.startsWith('/start') ||
        msg.text.startsWith('/help') ||
        msg.text.startsWith('/search') ||
        msg.text.startsWith('/setalert') ||
        msg.text.startsWith('/stopalert') ||
        msg.text.startsWith('/startalert') ||
        msg.text.startsWith('/deletealert') ||
        msg.text.startsWith('/viewalerts')
      ) {
        return;
      }

      const chatId = msg.chat.id;
      const telegramId = msg.from.id;
      const msgOptions = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      };
      const action = await RedisCache.GetItem(telegramId);

      if (action && action !== '') {
        await RedisCache.SetItem(telegramId, '', 1);
        RedisCache.DeleteItem(telegramId);
        const divider = 10;
        let pages = 0;
        let response;

        switch (action) {
          case 'SEARCH':
            TelegramBotHandler.sendMessage(chatId, `Processing your search for ${msg.text}……`, msgOptions);
            response = SearchService.findAll(msg.text);

            if (!response || response.count < 1) {
              TelegramBotHandler.sendMessage(chatId, `Sorry, No Product found. Try refining your search word. 😔`, msgOptions);
              return;
            }

            pages = response.products.length % divider === 0 ? response.productslength / divider : Number.parseInt(response.products.length / divider, 10) + 1;
            TelegramBotHandler.sendMessage(chatId, Util.showProductsListText(response.message, response.products), Util.getPagination(1, pages));
            TelegramBotHandler.handleCallbackQuery(response.products, pages, response.message);
            break;

          case 'SET_ALERT':
            TelegramBotHandler.sendMessage(chatId, `Cool, I will notify you when I find deals on ${msg.text}`, msgOptions);
            break;

          case 'START_ALERT':
            TelegramBotHandler.sendMessage(chatId, `Alert ${msg.text} has been restarted`, msgOptions);
            break;

          case 'STOP_ALERT':
            TelegramBotHandler.sendMessage(chatId, `Alert ${msg.text} has been stopped`, msgOptions);
            break;

          case 'DELETE_ALERT':
            TelegramBotHandler.sendMessage(chatId, `Alert ${msg.text} has been deleted`, msgOptions);
            break;

          default:
            TelegramBotHandler.sendMessage(chatId, 'Please choose the available options in the menu', msgOptions);
            break;
        }
        return;
      }

      if (msg.text.startsWith('/tag_')) {
        TelegramBotHandler.sendMessage(chatId, 'Fetching the Product information....', msgOptions);
        const response = await SearchService.findOne(msg.text);

        if (!response || response.product === {}) {
          TelegramBotHandler.sendMessage(chatId, `Sorry, I'm unable to process the request. 😔`, msgOptions);
          return;
        }

        TelegramBotHandler.sendMessage(chatId, Util.showProductInfotext(response.product), msgOptions);
        return;
      }

      TelegramBotHandler.sendMessage(chatId, `Processing your search for ${msg.text}……`, msgOptions);
      const response = SearchService.findAll(msg.text);

      if (!response || response.count < 1) {
        TelegramBotHandler.sendMessage(chatId, `Sorry, No Product found. Try refining your search word. 😔`, msgOptions);
        return;
      }

      const divider = 10;
      const pages = response.products.length % divider === 0 ? response.productslength / divider : Number.parseInt(response.products.length / divider, 10) + 1;
      TelegramBotHandler.sendMessage(chatId, Util.showProductsListText(response.message, response.products), Util.getPagination(1, pages));
      TelegramBotHandler.handleCallbackQuery(response.products, pages, response.message);
    });
  }

  static execute(TelegramBotHandler) {
    this.onStart(TelegramBotHandler);
    this.onUserInput(TelegramBotHandler);
    this.onBotCommands(TelegramBotHandler);
  }
}
