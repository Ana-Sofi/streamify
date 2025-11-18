import type { Id, Profile, Movie, ViewAggregated, Genre, StaffMember, MovieStaffAggregated, StaffMovieAggregated, AuthenticatedProfile } from "../model/streamify.model";

class StreamifyClient {
  private baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  private authHeaders: Record<string, string> = {
    ...this.baseHeaders,
    Authorization: "Bearer ",
  };
  private _accessToken = "";

  constructor() {
    this.loadTokenFromStorage();
  }

  private set accessToken(token: string) {
    token = token.trim();
    this.authHeaders["Authorization"] = `Bearer ${token}`;
    this._accessToken = token;
  }

  private get accessToken() {
    return this._accessToken;
  }

  // Unsafe practices never read/write access tokens to localStorag
  // using it here for safe of simplicity
  private loadTokenFromStorage() {
    this.accessToken = localStorage.getItem("streamify-token") || "";
  }

  private saveTokenToStorage(token: string) {
    localStorage.setItem("streamify-token", token);
  }

  async authenticate(credentials: { email: string; password: string }) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: this.baseHeaders,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    const { accessToken } = (await response.json()) as {
      accessToken: string;
    };
    this.accessToken = accessToken;
    this.saveTokenToStorage(accessToken);
  }

  async register(profile: Profile) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: this.baseHeaders,
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return (await response.json()) as Id<AuthenticatedProfile>;
  }

  clearToken() {
    this.accessToken = "";
    localStorage.removeItem("streamify-token");
  }

  hasToken() {
    return this.accessToken.length > 0;
  }

  async getMovies() {
    const response = await fetch("/api/movies", {
      method: "GET",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    return (await response.json()) as Id<Movie>[];
  }

  async getViews() {
    const response = await fetch("/api/views", {
      method: "GET",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch views");
    }

    return (await response.json()) as ViewAggregated[];
  }

  async getMovieById(id: number) {
    const response = await fetch(`/api/movies/${id}`, {
      method: "GET",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch movie");
    }

    return (await response.json()) as Id<Movie>;
  }

  async createView(movieId: number, score: number) {
    const response = await fetch("/api/views", {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify({ movieId, score }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create view");
    }

    return response.json();
  }

  async updateView(movieId: number, score: number) {
    const response = await fetch("/api/views", {
      method: "PATCH",
      headers: this.authHeaders,
      body: JSON.stringify({ movieId, score }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update view");
    }

    return response.json();
  }

  async createMovie(movie: Omit<Movie, "viewCount" | "scoreAverage">) {
    const response = await fetch("/api/movies", {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify(movie),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create movie");
    }

    return response.json();
  }

  async updateMovie(id: number, movie: Partial<Movie>) {
    const response = await fetch(`/api/movies/${id}`, {
      method: "PATCH",
      headers: this.authHeaders,
      body: JSON.stringify(movie),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update movie");
    }

    return response.json();
  }

  async deleteMovie(id: number) {
    const response = await fetch(`/api/movies/${id}`, {
      method: "DELETE",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete movie");
    }

    return response.json();
  }

  // Genres
  async getGenres(): Promise<Id<Genre>[]> {
    const response = await fetch("/api/genres", {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch genres");
    }

    return response.json();
  }

  async getGenreById(id: number): Promise<Id<Genre>> {
    const response = await fetch(`/api/genres/${id}`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch genre");
    }

    return response.json();
  }

  async createGenre(genre: Genre) {
    const response = await fetch("/api/genres", {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify(genre),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create genre");
    }

    return response.json();
  }

  async updateGenre(id: number, genre: Partial<Genre>) {
    const response = await fetch(`/api/genres/${id}`, {
      method: "PATCH",
      headers: this.authHeaders,
      body: JSON.stringify(genre),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update genre");
    }

    return response.json();
  }

  async deleteGenre(id: number) {
    const response = await fetch(`/api/genres/${id}`, {
      method: "DELETE",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete genre");
    }

    return response.json();
  }

  // Staff Members
  async getStaffMembers(): Promise<Id<StaffMember>[]> {
    const response = await fetch("/api/staff", {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch staff members");
    }

    return response.json();
  }

  async getStaffMemberById(id: number): Promise<Id<StaffMember>> {
    const response = await fetch(`/api/staff/${id}`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch staff member");
    }

    return response.json();
  }

  async createStaffMember(staffMember: StaffMember) {
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify(staffMember),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create staff member");
    }

    return response.json();
  }

  async updateStaffMember(id: number, staffMember: Partial<StaffMember>) {
    const response = await fetch(`/api/staff/${id}`, {
      method: "PATCH",
      headers: this.authHeaders,
      body: JSON.stringify(staffMember),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update staff member");
    }

    return response.json();
  }

  async deleteStaffMember(id: number) {
    const response = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete staff member");
    }

    return response.json();
  }

  // Movie Genres
  async getMovieGenres(movieId: number): Promise<Id<Genre>[]> {
    const response = await fetch(`/api/movies/${movieId}/genres`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch movie genres");
    }

    return response.json();
  }

  async addMovieGenre(movieId: number, genreId: number) {
    const response = await fetch(`/api/movies/${movieId}/genres`, {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify({ genreId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add genre to movie");
    }

    return response.json();
  }

  async removeMovieGenre(movieId: number, genreId: number) {
    const response = await fetch(`/api/movies/${movieId}/genres`, {
      method: "DELETE",
      headers: this.authHeaders,
      body: JSON.stringify({ genreId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove genre from movie");
    }

    return response.json();
  }

  // Movie Staff
  async getMovieStaff(movieId: number): Promise<MovieStaffAggregated[]> {
    const response = await fetch(`/api/movies/${movieId}/staff`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch movie staff");
    }

    return response.json();
  }

  async addMovieStaff(movieId: number, staffMemberId: number, roleName: string) {
    const response = await fetch(`/api/movies/${movieId}/staff`, {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify({ staffMemberId, roleName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add staff to movie");
    }

    return response.json();
  }

  async removeMovieStaff(movieId: number, movieStaffId: number) {
    const response = await fetch(`/api/movies/${movieId}/staff`, {
      method: "DELETE",
      headers: this.authHeaders,
      body: JSON.stringify({ id: movieStaffId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove staff from movie");
    }

    return response.json();
  }

  // Genre Movies
  async getGenreMovies(genreId: number): Promise<Id<Movie>[]> {
    const response = await fetch(`/api/genres/${genreId}/movies`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch genre movies");
    }

    return response.json();
  }

  async addGenreMovie(genreId: number, movieId: number) {
    const response = await fetch(`/api/genres/${genreId}/movies`, {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify({ movieId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add movie to genre");
    }

    return response.json();
  }

  async removeGenreMovie(genreId: number, movieId: number) {
    const response = await fetch(`/api/genres/${genreId}/movies`, {
      method: "DELETE",
      headers: this.authHeaders,
      body: JSON.stringify({ movieId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove movie from genre");
    }

    return response.json();
  }

  // Staff Movies
  async getStaffMovies(staffMemberId: number): Promise<StaffMovieAggregated[]> {
    const response = await fetch(`/api/staff/${staffMemberId}/movies`, {
      headers: this.authHeaders,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch staff movies");
    }

    return response.json();
  }

  async addStaffMovie(staffMemberId: number, movieId: number, roleName: string) {
    const response = await fetch(`/api/staff/${staffMemberId}/movies`, {
      method: "POST",
      headers: this.authHeaders,
      body: JSON.stringify({ movieId, roleName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add movie to staff");
    }

    return response.json();
  }

  async removeStaffMovie(staffMemberId: number, staffMovieId: number) {
    const response = await fetch(`/api/staff/${staffMemberId}/movies`, {
      method: "DELETE",
      headers: this.authHeaders,
      body: JSON.stringify({ id: staffMovieId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove movie from staff");
    }

    return response.json();
  }
}

export const streamifyClient = new StreamifyClient();
