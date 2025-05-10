import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

class ScreeningModel extends Model {
  public id!: string;
  public movieId!: string;
  public roomId!: string;
  public startTime!: Date;
  public endTime!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ScreeningModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    movieId: {
      field: 'movie_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomId: {
      field: 'room_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      field: 'start_time',
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      field: 'end_time',
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'screenings',
    timestamps: true,
  }
);

export default ScreeningModel;
