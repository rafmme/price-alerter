import dotenv from 'dotenv';
import RedisCache from '../cache/redis';
import Util from '../utils';
import RequestBuilder from '../utils/request/requestQueryBuilder';

dotenv.config();

const { BACKEND_API: baseUrl } = process.env;

/**
 * @class
 * @classdesc
 */
export default class SearchService {
  static async findAll(word, userId, ns = false) {
    try {
      const key = word.toLowerCase();
      const cacheResponse = await RedisCache.GetItem(key);

      if (userId) {
        await RedisCache.SetItem(`ls_${userId}`, key, 86400 * 1);
      }

      if (cacheResponse && ns === false) {
        return JSON.parse(cacheResponse);
      }

      const { query, price } = Util.createSearchUrl(word);
      const url = `${baseUrl}/search`;
      await new RequestBuilder().withURL(baseUrl).method('GET').queryParams({}).build().send();

      const response = await new RequestBuilder()
        .withURL(url)
        .method('GET')
        .queryParams({
          word: query,
          price_range: price,
        })
        .build()
        .send();

      await RedisCache.SetItem(key, JSON.stringify(response), 60 * 60 * 7);
      return response;
    } catch (error) {
      return null;
    }
  }

  static async findOne(tag) {
    try {
      const key = tag.toLowerCase();
      const cacheResponse = await RedisCache.GetItem(key);

      if (cacheResponse) {
        return JSON.parse(cacheResponse);
      }

      const url = `${baseUrl}/info`;
      await new RequestBuilder().withURL(baseUrl).method('GET').queryParams({}).build().send();

      const response = await new RequestBuilder()
        .withURL(url)
        .method('GET')
        .queryParams({
          tag: tag.replace('/tag_', '/'),
        })
        .build()
        .send();

      await RedisCache.SetItem(key, JSON.stringify(response), 86400);
      return response;
    } catch (error) {
      return null;
    }
  }
}
