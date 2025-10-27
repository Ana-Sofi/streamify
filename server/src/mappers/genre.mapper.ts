import {DbGenre} from '../repositories/genres.repository';
import {Genre} from '../model/genre.model';
import {Id} from '../model/id.model';
import {makeMapFunction} from '../utils/map.util';

export const dbGenreToModelGenre = makeMapFunction([
  ['genre_id', 'id'],
  ['genre_name', 'name'],
]) as (dbGenre: DbGenre) => Id<Genre>;
