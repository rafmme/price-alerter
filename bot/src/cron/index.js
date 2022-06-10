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
            const { telegramId, term, id } = alert;
            const response = await SearchService.findAll(term, telegramId, true);

            if (response && response.count >= 1) {
              const alertData = {
                id: Number.parseInt(id, 10),
                telegramId,
              };
              await AlertsService.update({ where: alertData }, { isOn: false });
              const text = Util.showAlertsProductsListText(
                `I have found <i>${response.count}</i> deals on <i>"${term}"</i> that I think you should have a look at.`,
                response.products,
              );

              const message = text.length > 4096 ? text.slice(0, 4096) : text;
              TelegramBotHandler.sendMessage(telegramId, message, {
                parse_mode: 'HTML',
              });
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
    this.checkForDeals('0 */20 * * * *').start();
  }
}
