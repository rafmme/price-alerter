import dotenv from 'dotenv';
import Util from '../utils';
import RequestBuilder from '../utils/request/requestQueryBuilder';

dotenv.config();

/**
 * @class
 * @classdesc
 */
export default class SearchService {
  /**
   * @constructor
   * @description
   */
  constructor() {
    const { BACKEND_API } = process.env;

    if (typeof this.instance === 'object') {
      return this.instance;
    }

    this.baseUrl = BACKEND_API;
    this.requestQueryBuilder = RequestBuilder;
    SearchService.instance = this;
    return this;
  }

  /**
   * @static
   * @description
   */
  static GetInstance() {
    const searchService = new this();
    return searchService;
  }

  /**
   *
   * @param {String} word
   * @returns {Array}
   */
  static async findAll(word) {
    try {
      const { query, price } = Util.createSearchUrl(word);
      const url = `${this.GetInstance().baseUrl}/search`;

      await new this.GetInstance().requestQueryBuilder().withURL(this.GetInstance().baseUrl).method('GET').queryParams({}).build().send();

      const response = await new this.GetInstance()
        .requestQueryBuilder()
        .withURL(url)
        .method('GET')
        .queryParams({
          word: query,
          price_range: price,
        })
        .build()
        .send();

      return response;
    } catch (error) {
      return null;
    }
  }

  static async findOne(tag) {
    try {
      const url = `${this.GetInstance().baseUrl}/info`;

      await new this.GetInstance().requestQueryBuilder().withURL(this.GetInstance().baseUrl).method('GET').queryParams({}).build().send();

      const response = await new this.GetInstance()
        .requestQueryBuilder()
        .withURL(url)
        .method('GET')
        .queryParams({
          tag: tag.replace('/tag_', '/'),
        })
        .build()
        .send();

      return response;
    } catch (error) {
      return null;
    }
  }
}
