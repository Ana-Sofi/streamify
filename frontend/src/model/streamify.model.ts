export type Id<T extends {}> = { id: number } & T;

export type Genre = {
  name: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Profile = {
  name: string;
  lastName: string;
} & Credentials;

export type Role = "administrator" | "regular";

export type AuthenticatedProfile = {
  role: Role;
} & Omit<Profile, "password">;

export type Movie = {
  name: string;
  description: string;
  viewCount: number;
  scoreAverage: number;
  imageUrl?: string;
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

export type StaffMember = {
  name: string;
  lastName: string;
};

export type MovieGenre = {
  movieId: number;
  genreId: number;
};

export type MovieStaff = {
  movieId: number;
  staffMemberId: number;
  roleName: string;
};

export type MovieStaffAggregated = {
  id: number;
  member: Id<StaffMember>;
  roleName: string;
};

export type StaffMovieAggregated = {
  id: number;
  movie: Id<Movie>;
  roleName: string;
};
