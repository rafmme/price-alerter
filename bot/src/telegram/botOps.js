import RedisCache from '../cache/redis';
import SearchService from '../service/search.service';
import UsersService from '../service/users.service';
import AlertsService from '../service/alerts.service';
import Util from '../utils';
import constants from './constants';
import Validator from '../utils/validator';

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
      const chatId = msg.chat.id;
      const name = `${msg.from.first_name}`;
      const userExist = await Validator.checkIfResourceExist(UsersService, {
        where: {
          telegramId: chatId,
        },
      });
      const msgOptions = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML',
      };

      if (userExist) {
        TelegramBotHandler.sendMessage(chatId, constants.oldUserStartText(name), msgOptions);
        return;
      }
      await UsersService.create({ name, telegramId: chatId });
      TelegramBotHandler.sendMessage(chatId, constants.newUserStartText(name), msgOptions);
    });
  }

  /**
   * @static
   * @description
   * @param {Function} TelegramBotHandler
   */
  static onBotCommands(TelegramBotHandler) {
    const msgOptions = {
      reply_to_message_id: '',
      parse_mode: 'HTML',
    };

    TelegramBotHandler.onText(/^\/help$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      TelegramBotHandler.sendMessage(chatId, constants.helpText, msgOptions);
    });

    TelegramBotHandler.onText(/^\/search$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      await RedisCache.SetItem(chatId, 'SEARCH', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the Product name within the next 5 minutes or Send exit to abort.\nFor example: Nokia Phone\nTo specify price range too, send Nokia Phone@20,000-70,000',
        msgOptions,
      );
    });

    TelegramBotHandler.onText(/^\/setalert$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      await RedisCache.SetItem(chatId, 'SET_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the Alert details within the next 5 minutes or Send exit to abort.\nFor example: Nokia Phone@20,000-70,000\ni.e Name of Product@Price-Range',
        msgOptions,
      );
    });

    TelegramBotHandler.onText(/^\/stopalert$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      await RedisCache.SetItem(chatId, 'STOP_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the ID of the Alert you want stopped within the next 5 minutes or Send exit to abort.\nFor example: `02334`',
        msgOptions,
      );
    });

    TelegramBotHandler.onText(/^\/startalert$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      await RedisCache.SetItem(chatId, 'START_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the ID of the Alert you want restarted within the next 5 minutes or Send exit to abort.\nFor example: `02334`',
        msgOptions,
      );
    });

    TelegramBotHandler.onText(/^\/deletealert$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      await RedisCache.SetItem(chatId, 'DELETE_ALERT', 60 * 5);
      TelegramBotHandler.sendMessage(
        chatId,
        'Please enter the ID of the Alert you want deleted within the next 5 minutes or Send exit to abort.\nFor example: `02334`',
        msgOptions,
      );
    });

    TelegramBotHandler.onText(/^\/viewalerts$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      const alertsList = await AlertsService.findAll({
        where: {
          telegramId: chatId,
        },
      });

      const alerts = Util.showUserAlertsText('Your Alerts List:', alertsList);
      TelegramBotHandler.sendMessage(chatId, alerts, msgOptions);
    });

    TelegramBotHandler.onText(/^\/viewactivealerts$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      const alertsList = await AlertsService.findAll({
        where: {
          telegramId: chatId,
          isOn: true,
        },
      });

      const alerts = Util.showUserAlertsText('Your Active Alerts List:', alertsList);
      TelegramBotHandler.sendMessage(chatId, alerts, msgOptions);
    });

    TelegramBotHandler.onText(/^\/viewstoppedalerts$/, async (msg) => {
      const chatId = msg.chat.id;
      msgOptions.reply_to_message_id = msg.message_id;
      const alertsList = await AlertsService.findAll({
        where: {
          telegramId: chatId,
          isOn: false,
        },
      });

      const alerts = Util.showUserAlertsText('Your Stopped Alerts List:', alertsList);
      TelegramBotHandler.sendMessage(chatId, alerts, msgOptions);
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
        msg.text.startsWith('/viewalerts') ||
        msg.text.startsWith('/viewactivealerts') ||
        msg.text.startsWith('/viewstoppedalerts')
      ) {
        return;
      }

      const chatId = msg.chat.id;
      const telegramId = msg.from.id;
      const msgOptions = {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML',
      };
      const action = await RedisCache.GetItem(telegramId);

      if (action && action !== '') {
        await RedisCache.SetItem(telegramId, '', 1);
        RedisCache.DeleteItem(telegramId);
        const divider = 5;
        let response;
        let pages = 0;

        let alertData = {
          id: Number.parseInt(msg.text, 10),
          telegramId: chatId,
        };
        let alertExist = await Validator.checkIfResourceExist(AlertsService, {
          where: alertData,
        });

        if (msg.text.toLowerCase() === 'exit') {
          TelegramBotHandler.sendMessage(chatId, `Intented action has been terminated!`, msgOptions);
          return;
        }

        switch (action) {
          case 'SEARCH':
            response = await SearchService.findAll(msg.text, chatId);

            if (!response || response.count < 1) {
              TelegramBotHandler.sendMessage(chatId, `Sorry, No Product found. Try refining your search word. 😔`, msgOptions);
              return;
            }

            pages = response.products.length % divider === 0 ? response.products.length / divider : Number.parseInt(response.products.length / divider, 10) + 1;
            TelegramBotHandler.sendMessage(
              chatId,
              Util.showProductsListText(`${response.message}\n\nI found ${response.count} item(s).`, response.products.slice(0, divider)),
              Util.getPagination(1, pages),
            );
            TelegramBotHandler.handleCallbackQuery(response.products, pages, response.message);

            break;

          case 'SET_ALERT':
            alertData = {
              term: msg.text.toLowerCase(),
              telegramId: chatId,
            };
            alertExist = await Validator.checkIfResourceExist(AlertsService, {
              where: alertData,
            });

            if (alertExist) {
              TelegramBotHandler.sendMessage(chatId, `❌ Oops! it looks like you already have an alert with the same term <b><i>${msg.text}</i></b>.`, msgOptions);
            } else {
              await AlertsService.create(alertData);
              TelegramBotHandler.sendMessage(chatId, `👍🏾 Cool, I will notify you when I find deals on <b><i>${msg.text}</i></b>.`, msgOptions);
            }

            break;

          case 'START_ALERT':
            if (alertExist) {
              await AlertsService.update({ where: alertData }, { isOn: true });
              TelegramBotHandler.sendMessage(chatId, `✅ Your Alert with ID <b><i>${msg.text}</i></b> has been restarted`, msgOptions);
            } else {
              TelegramBotHandler.sendMessage(chatId, `❌ Oops! You have no Alert with the ID of<b><i>${msg.text}</i></b>`, msgOptions);
            }

            break;

          case 'STOP_ALERT':
            if (alertExist) {
              await AlertsService.update({ where: alertData }, { isOn: false });
              TelegramBotHandler.sendMessage(chatId, `✅ Your Alert with ID <b><i>${msg.text}</i></b> has been stopped.`, msgOptions);
            } else {
              TelegramBotHandler.sendMessage(chatId, `❌ Oops! You have no Alert with the ID of<b><i>${msg.text}</i></b>`, msgOptions);
            }

            break;

          case 'DELETE_ALERT':
            if (alertExist) {
              await AlertsService.remove({ where: alertData });
              TelegramBotHandler.sendMessage(chatId, `✅ Your Alert with ID <b><i>${msg.text}</i></b> has been deleted.`, msgOptions);
            } else {
              TelegramBotHandler.sendMessage(chatId, `❌ Oops! You have no Alert with the ID of<b><i>${msg.text}</i></b>`, msgOptions);
            }

            break;

          default:
            TelegramBotHandler.sendMessage(chatId, 'Please choose the available options in the menu', msgOptions);
            break;
        }
        return;
      }

      if (msg.text.startsWith('/tag_')) {
        const response = await SearchService.findOne(msg.text);

        if (!response || response.product === {}) {
          TelegramBotHandler.sendMessage(chatId, `Sorry, I'm unable to process the request. 😔`, msgOptions);
          return;
        }

        TelegramBotHandler.sendMessage(chatId, Util.showProductInfotext(response.product), msgOptions);
        return;
      }

      const response = await SearchService.findAll(msg.text, chatId);

      if (!response || response.count < 1) {
        TelegramBotHandler.sendMessage(chatId, `Sorry, No Product found. Try refining your search word. 😔`, msgOptions);
        return;
      }

      const divider = 5;
      const pages = response.products.length % divider === 0 ? response.products.length / divider : Number.parseInt(response.products.length / divider, 10) + 1;
      TelegramBotHandler.sendMessage(
        chatId,
        Util.showProductsListText(`${response.message}\n\nI found ${response.count} item(s).`, response.products.slice(0, divider)),
        Util.getPagination(1, pages),
      );
      TelegramBotHandler.handleCallbackQuery(response.products, pages, response.message);
    });
  }

  static execute(TelegramBotHandler) {
    this.onStart(TelegramBotHandler);
    this.onUserInput(TelegramBotHandler);
    this.onBotCommands(TelegramBotHandler);
  }
}
