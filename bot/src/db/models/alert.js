const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Alert.belongsTo(models.User, {
        foreignKey: 'telegramId',
        targetKey: 'telegramId',
      });
    }
  }
  Alert.init(
    {
      telegramId: DataTypes.INTEGER,
      messageId: DataTypes.INTEGER,
      term: DataTypes.STRING,
      isOn: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Alert',
    },
  );
  return Alert;
};
