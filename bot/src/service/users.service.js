import Service from '.';
import { User } from '../db/models';

/**
 * @class
 * @classdesc
 */
export default class UsersService extends Service {
  /**
   * @constructor
   * @description
   */
  constructor(model = User) {
    super(model);
  }
}
