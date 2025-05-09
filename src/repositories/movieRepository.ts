import Movie from "../db/models/movie";

export const findAllMovies = () => Movie.findAll();

export const findMovieById = (id: string | number) =>
  Movie.findByPk(id);

export const createMovie = (data: any) =>
  Movie.create(data);

export const updateMovie = (id: string | number, data: any) =>
  Movie.update(data, { where: { id } });

export const removeMovie = (id: string | number) =>
  Movie.destroy({ where: { id } });


export default {
  findAllMovies,
  findMovieById,
  createMovie,
  updateMovie,
  removeMovie
};