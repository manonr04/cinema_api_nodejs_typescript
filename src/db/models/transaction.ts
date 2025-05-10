import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';
import { User } from './user';

export class Transaction extends Model {
  id!: number;
  userId!: number;
  amount!: number;
  type!: 'deposit' | 'withdrawal' | 'ticket_purchase';
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'ticket_purchase'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'transactions',
  timestamps: true,
});

Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

export default Transaction;
