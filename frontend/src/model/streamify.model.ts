export type Id<T extends {}> = { id: number } & T;

export type Credentials = {
  email: string;
  password: string;
};

export type Profile = {
  name: string;
  lastName: string;
} & Credentials;

export type Movie = {
  name: string;
  description: string;
  viewCount: number;
  scoreAverage: number;
};

export type View = {
  score: number;
  profileId: number;
  movieId: number;
};

export type ViewAggregated = {
  score: number;
  movie: Id<Movie>;
};
