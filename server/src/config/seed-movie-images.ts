import * as dotenv from 'dotenv';
dotenv.config();
import {getAllMovies, patchMovie} from '../repositories/movies.repository';

type ImdbSearchResult = {
  ok: boolean;
  description: {
    '#TITLE': string;
    '#YEAR': number;
    '#IMDB_ID': string;
    '#RANK': number;
    '#ACTORS': string;
    '#AKA': string;
    '#IMDB_URL': string;
    '#IMDB_IV': string;
    '#IMG_POSTER': string;
    photo_width: number;
    photo_height: number;
  }[];
};

async function searchImdb(movieName: string) {
  const res = await fetch(
    `https://imdb.iamidiotareyoutoo.com/search?q=${movieName}`,
  );
  const movies = (await res.json()) as ImdbSearchResult;
  return movies.description;
}

(async () => {
  const movies = await getAllMovies();

  for (const movie of movies) {
    const result = await searchImdb(movie.name);
    const exactMatch = result.find(
      m => m['#TITLE'].toLowerCase() == movie.name.toLowerCase(),
    );
    exactMatch
      ? console.log(`Exact match: ${movie.name}`)
      : console.log(`No exact match found:   ${movie.name}`);
    if (!exactMatch) continue;
    await patchMovie({id: movie.id, imageUrl: exactMatch['#IMG_POSTER']});
  }
})();
