import Movie from './movie';
import Room from './room';
import Screening from './seance';

Movie.hasMany(Screening, { foreignKey: 'movie_id' });
Screening.belongsTo(Movie, { foreignKey: 'movie_id' });

Room.hasMany(Screening, { foreignKey: 'room_id' });
Screening.belongsTo(Room, { foreignKey: 'room_id' });