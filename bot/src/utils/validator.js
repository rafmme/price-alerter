import UsersService from '../service/users.service';

export default class Validator {
  static async checkIfUserExist() {
    await UsersService.findOne();
  }
}
