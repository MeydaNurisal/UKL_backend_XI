'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.OrderDetail,{foreignKey:'order_id', as:'OrderDetails'})
      
    }
  }
  OrderList.init({
    customer_name: DataTypes.STRING,
    order_type: DataTypes.STRING,
    order_date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderList',
  });
  return OrderList;
};