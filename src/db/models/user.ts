import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

export class User extends Model {
  id!: string;
  email!: string;
  password!: string;
  role!: string[];
  firstName!: string;
  lastName!: string;
  accountBalance!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  accountBalance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'account_balance',
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
  tableName: 'users',
  timestamps: true,
});

export default User;
