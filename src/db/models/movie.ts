import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize';

class MovieModel extends Model {
  public id!: string;
  public title!: string;
  public description?: string;
  public duration!: number;
  public releaseDate?: Date;
  public genre?: string;
  public afficheUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MovieModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    releaseDate: {
      field: 'release_date',
      type: DataTypes.DATE,
    },
    genre: {
      type: DataTypes.STRING,
    },
    afficheUrl: {
      field: 'affiche_url',
      type: DataTypes.STRING,
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
    tableName: 'movies',
    timestamps: true,
  }
);

export default MovieModel;