import Service from '.';
import { Alert } from '../db/models';

/**
 * @class
 * @classdesc
 */
export default class AlertsService extends Service {
  /**
   * @constructor
   * @description
   */
  constructor(model = Alert) {
    super(model);
  }
}
