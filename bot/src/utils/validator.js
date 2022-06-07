export default class Validator {
  static async checkIfResourceExist(service, queryObj) {
    const resource = await service.findOne(queryObj);

    if (resource) return true;

    return false;
  }
}
