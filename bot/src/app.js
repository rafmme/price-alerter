import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import pingmydyno from 'pingmydyno';
import TelegramBotHandler from './telegram';
import Util from './utils';

dotenv.config();

const { PORT: APP_PORT, APP_URL, PING_DYNO } = process.env;
const PORT = Number.parseInt(APP_PORT, 10) || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello, World! Welcome to Dealz Finder App',
  });
});

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

TelegramBotHandler.init();

export default app;
