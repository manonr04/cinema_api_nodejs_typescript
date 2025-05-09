import * as service from "../services/seanceService";
import { Request, Response } from "express";

export const createSeance = async (req: Request, res: Response) => {
  try {
    const result = await service.createSeance(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllSeance = async (req: Request, res: Response) => {
  const result = await service.getSeance(req.query);
  res.json(result);
};

export const getOneSeance = async (req: Request, res: Response) => {
  const result = await service.getSeanceById(Number(req.params.id));
  res.json(result);
};

export const updateSeance = async (req: Request, res: Response) => {
  const result = await service.updateSeance(Number(req.params.id), req.body);
  res.json(result);
};

export const removeSeance = async (req: Request, res: Response) => {
  await service.removeSeance(Number(req.params.id));
  res.status(204).end();
};
