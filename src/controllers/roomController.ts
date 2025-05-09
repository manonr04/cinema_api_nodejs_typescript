import { Request, Response } from "express";
import * as service from "../services/roomService";

export const getAllRooms = async (req: Request, res: Response) => {
  const rooms = await service.getAllRooms();
  res.json(rooms);
};

export const getRoomById = async (req: Request, res: Response) => {
  const room = await service.getRoomById(req.params.id);
  res.json(room);
};

export const createRoom = async (req: Request, res: Response) => {
  const room = await service.createRoom(req.body);
  res.status(201).json(room);
};

export const updateRoom = async (req: Request, res: Response) => {
  const updated = await service.updateRoom(req.params.id, req.body);
  res.json(updated);
};

export const deleteRoom = async (req: Request, res: Response) => {
  await service.deleteRoom(req.params.id);
  res.status(204).send();
};