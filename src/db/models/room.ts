import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class Room extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public type!: string;
  public capacity!: number;
  public handicap_access?: boolean;
  public in_maintenance!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  type: { type: DataTypes.STRING, allowNull: false },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 15, max: 30 },
  },
  handicap_access: { type: DataTypes.BOOLEAN, defaultValue: false },
  in_maintenance: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  tableName: "rooms",
});

export default Room