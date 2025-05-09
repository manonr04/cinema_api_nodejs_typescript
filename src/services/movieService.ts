//import Movie from '../db/models/movie';
import movieRepository from '../repositories/movieRepository';

export const getAllMovies = () => {
  return movieRepository.findAllMovies();
}

export const getMovieById = (id: string) => {
  return movieRepository.findMovieById(id);
}

export const createMovie = (data: any) => {
  return movieRepository.createMovie(data);
};

export const updateMovie = (id: string, data: any) => {
  return movieRepository.updateMovie(id, data);
};

export const deleteMovie = (id: string) => movieRepository.removeMovie(id);