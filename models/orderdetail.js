'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Coffee, {foreignKey: 'coffee_id'})
      this.belongsTo(models.OrderList, {foreignKey: 'order_id'})
    }
    
  }
  OrderDetail.init({
    order_id: DataTypes.INTEGER,
    coffee_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};