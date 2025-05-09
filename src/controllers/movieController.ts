import { Request, Response } from "express";
import * as service from "../services/movieService";

export const getAllMovies = async (req: Request, res: Response) => {
  const rooms = await service.getAllMovies();
  res.json(rooms);
};

export const getMovieById = async (req: Request, res: Response) => {
  const room = await service.getMovieById(req.params.id);
  res.json(room);
};

export const createMovie = async (req: Request, res: Response) => {
  const room = await service.createMovie(req.body);
  res.status(201).json(room);
};

export const updateMovie = async (req: Request, res: Response) => {
  const updated = await service.updateMovie(req.params.id, req.body);
  res.json(updated);
};

export const deleteMovie = async (req: Request, res: Response) => {
  await service.deleteMovie(req.params.id);
  res.status(204).send();
};