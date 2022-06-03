import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import pingmydyno from 'pingmydyno';
import Util from './utils';
/* import Cron from './cron_jobs';
import { startTelegramBot } from './telegram'; */

dotenv.config();

const { PORT: APP_PORT, APP_URL, PING_DYNO } = process.env;
const PORT = Number.parseInt(APP_PORT, 10) || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', async (req, res) => {
  const a = await Util.MakeHTTPRequest({ url: `http://localhost:5000` });
  console.log(a, '::: - :::');

  res.status(200).send({
    message: 'Hello, World! Welcome to Dealz Finder App',
  });
});

/* Cron.StartCronJobs();
(async () => startTelegramBot())(); */

if (!module.parent) {
  app.listen(PORT, () => {
    if (PING_DYNO && (PING_DYNO === 'yes' || PING_DYNO === 'allow' || PING_DYNO === 'true')) {
      pingmydyno(`${APP_URL}`, {
        onSuccess: () => {
          console.log('PINGED');
        },
      });
    }
    console.log(`App is live on ${PORT}`);
  });
}

export default app;
