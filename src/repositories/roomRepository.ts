import { Room } from "../db/models/room";

export const findAll = () => Room.findAll();

export const findById = (id: string | number) =>
  Room.findByPk(id);

export const create = (data: Partial<Room>) =>
  Room.create(data);

export const update = (id: string | number, data: Partial<Room>) =>
  Room.update(data, { where: { id } });

export const remove = (id: string | number) =>
  Room.destroy({ where: { id } });