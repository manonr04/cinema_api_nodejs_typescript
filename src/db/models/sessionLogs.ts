import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';
import User from './user'; // suppose que tu as un modèle User

export class SessionLog extends Model {
  id!: string;
  userId!: string;
  type!: 'login' | 'logout';
  timestamp!: Date;
}

SessionLog.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  type: {
    type: DataTypes.ENUM('login', 'logout'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'session_logs',
  timestamps: false,
});

SessionLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(SessionLog, { foreignKey: 'user_id' });

export default SessionLog;
