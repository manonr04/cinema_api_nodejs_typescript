import * as repo from "../repositories/seanceRepository"
import * as movieService from '../services/movieService';

export const createSeance = async (data: any) => {
  const movie = await movieService.getMovieById(data.movieId);
  if (!movie) throw new Error("Film introuvable");

  const startTime = new Date(data.startTime);

  const startHour = startTime.getHours();
  if (startHour < 9 || startHour >= 20) {
    throw new Error("La séance doit être entre 9h et 20h.");
  }

  const duration = movie.duration + 30;
  const endIime = new Date(startTime.getTime() + duration * 60000);
  console.log(endIime.toISOString());

  const hasConflict = await repo.hasConflictingScreeningInOneRoom(data.roomId, startTime, endIime);
  if (hasConflict) throw new Error("Conflit avec une autre séance");

  const hasConflitWithOtherRoom = await repo.hasConflictingScreeningForSameMovie(data.movieId, startTime, endIime);
  if (hasConflitWithOtherRoom) throw new Error("Conflit avec une autre salle");

  return repo.createSeance({ ...data, endIime });
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


