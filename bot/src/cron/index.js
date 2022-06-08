import cron from 'node-cron';
import dotenv from 'dotenv';
import AlertsService from '../service/alerts.service';
import SearchService from '../service/search.service';
import TelegramBotHandler from '../telegram';
import Util from '../utils';

dotenv.config();

const { TZ } = process.env;

export default class Cron {
  static checkForDeals(schedule, timezone = TZ) {
    if (cron.validate(schedule)) {
      const task = cron.schedule(
        schedule,
        async () => {
          const alerts = await AlertsService.findAll({
            where: {
              isOn: true,
            },
          });

          alerts.forEach(async (alert) => {
            const divider = 10;
            const { telegramId, term } = alert;
            const response = await SearchService.findAll(term, telegramId, true);

            if (response || response.count < 1) {
              const pages = response.products.length % divider === 0 ? response.products.length / divider : Number.parseInt(response.products.length / divider, 10) + 1;
              TelegramBotHandler.sendMessage(
                telegramId,
                Util.showProductsListText(
                  `I have found <i>${response.count}</i> deals on <i>"${term}"</i> that I think you should have a look at.`,
                  response.products.slice(0, divider),
                ),
                Util.getPagination(1, pages),
              );
              TelegramBotHandler.handleCallbackQuery(response.products, pages, response.message);
            }
          });
        },
        {
          timezone,
        },
      );
      return task;
    }
    throw new Error(`${schedule} is not valid`);
  }

  static runJobs() {
    this.checkForDeals('0 */40 * * * *').start();
  }
}
