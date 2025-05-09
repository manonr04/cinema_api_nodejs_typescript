import * as repo from "../repositories/seanceRepository"
import Movie from "../db/models/movie";

export const createSeance = async (data: any) => {
  // pas find pas pk mais par name ?
  const movie = await Movie.findByPk(data.movie_id);
  if (!movie) throw new Error("Film introuvable");

  const duration = movie.duration + 30;
  const end_time = new Date(new Date(data.start_time).getTime() + duration * 60000);

  const hasConflict = await repo.hasConflictingScreening(data.room_id, new Date(data.start_time), end_time);
  if (hasConflict) throw new Error("Conflit avec une autre séance");

  return repo.createSeance({ ...data, end_time });
};

export const getSeance = (filters: any) => {
  return repo.findAllSeances(filters);
}

export const getSeanceById = (id: number) => {
  return repo.findSeanceById(id);
}

export const updateSeance = (id: number, data: any) => {
  return repo.updateSeance(id, data);
}

export const removeSeance = (id: number) => {
  return repo.removeSeance(id);
}

export default {
  createSeance,
  getSeance,
  getSeanceById,
  updateSeance,
  removeSeance,
}


