import Screening from "../db/models/seance";
import ScreeningModel from '../db/models/seance';
import { Op } from 'sequelize';

export const findAllSeances = (filters = {}) =>  {
  return Screening.findAll({ where: filters });
}

export const findSeanceById = (id: number) => {
  return Screening.findByPk(id);
}

export const createSeance = (data: any) => {
  return Screening.create(data);
}

export const updateSeance = (id: number, data: any) => {
  Screening.update(data, { where: { id } });
}

export const removeSeance = (id: number) => {
  return Screening.destroy({ where: { id } });
}

export const hasConflictingScreening = async (
  roomId: string,
  startTime: Date,
  endTime: Date
) => {
  const conflict = await ScreeningModel.findOne({
    where: {
      roomId,
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          endTime: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          startTime: {
            [Op.lte]: startTime,
          },
          endTime: {
            [Op.gte]: endTime,
          },
        },
      ],
    },
  });

  return !!conflict;
};

export default {
  findAllSeances,
  findSeanceById,
  createSeance,
  updateSeance,
  removeSeance
}