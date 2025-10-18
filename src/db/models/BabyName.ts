import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';


export const BabyName = sequelize.define('BabyName', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM('M', 'F', 'U'),
    allowNull: false,
    defaultValue: 'U',
  },
}, {
  tableName: 'baby_names',
  timestamps: true, // Just to keep track of creation and updation automatically.
});
