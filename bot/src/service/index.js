/**
 * @class
 * @classdesc
 */
export default class Service {
  /**
   * @constructor
   * @description
   */
  constructor(model = null) {
    if (typeof this.instance === 'object') {
      return this.instance;
    }

    this.model = model;
    Service.instance = this;
    return this;
  }

  /**
   * @static
   * @description
   */
  static GetInstance() {
    const service = new this();
    return service;
  }

  static async create(data) {
    try {
      const newRecord = await this.GetInstance().model.create(data);
      return newRecord.dataValues;
    } catch (error) {
      return null;
    }
  }

  static async findAll(queryObj) {
    try {
      const list = [];
      const records = await this.GetInstance().model.findAll(queryObj);
      records.map((record) => list.push(record.dataValues));
      return list;
    } catch (error) {
      return null;
    }
  }

  static async findOne(queryObj) {
    try {
      const record = await this.GetInstance().model.findOne(queryObj);
      if (record) return record.dataValues;
      return null;
    } catch (error) {
      return null;
    }
  }

  static async update(queryObj, data) {
    try {
      const record = await this.GetInstance().model.findOne(queryObj);
      if (record) return (await record.update(data)).dataValues;
      return null;
    } catch (error) {
      return null;
    }
  }

  static async remove(queryObj) {
    try {
      const record = await this.GetInstance().model.findOne(queryObj);
      if (record) {
        await record.destroy();
        return 1;
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }
}
