import {DbGenre} from '../repositories/genres.repository';
import {Genre} from '../model/genre.model';
import {Id} from '../model/id.model';

export const dbGenreToModelGenre = (dbGenre: DbGenre): Id<Genre> => {
  return {
    id: dbGenre.genre_id,
    name: dbGenre.genre_name,
  };
};
