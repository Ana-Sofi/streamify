import { useAuth } from "../hooks/useAuth";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { streamifyClient } from "../api/streamify-client";
import type { Id, Movie, ViewAggregated, Genre, StaffMember } from "../model/streamify.model";
import { MovieCard } from "../components/MovieCard";
import { MovieRatingModal } from "../components/MovieRatingModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Home() {
  const { isLoading } = useProtectedRoute();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Id<Movie>[]>([]);
  const [allMovies, setAllMovies] = useState<Id<Movie>[]>([]);
  const [views, setViews] = useState<ViewAggregated[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Id<Movie> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Id<Genre> | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Id<StaffMember> | null>(null);
  const [genres, setGenres] = useState<Id<Genre>[]>([]);
  const [staffMembers, setStaffMembers] = useState<Id<StaffMember>[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, viewsData] = await Promise.all([
          streamifyClient.getMovies(),
          streamifyClient.getViews(),
        ]);
        setAllMovies(moviesData);
        setMovies(moviesData);
        setViews(viewsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [isLoading]);

  // Load genres and staff for filter modal
  useEffect(() => {
    const loadFilterData = async () => {
      if (!isFilterModalOpen) return;
      
      setIsLoadingFilters(true);
      try {
        const [genresData, staffData] = await Promise.all([
          streamifyClient.getGenres(),
          streamifyClient.getStaffMembers(),
        ]);
        setGenres(genresData);
        setStaffMembers(staffData);
      } catch (error) {
        console.error("Failed to load filter data:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilterData();
  }, [isFilterModalOpen]);

  // Apply search only when no filters are active
  useEffect(() => {
    // Don't apply search if filters are active - filters are handled by API calls
    if (selectedGenre || selectedStaff) {
      return;
    }

    // Apply search query on allMovies
    if (searchQuery.trim()) {
      const filteredMovies = allMovies.filter((movie) =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMovies(filteredMovies);
    } else {
      // No search query and no filters - show all movies
      setMovies(allMovies);
    }
  }, [searchQuery, allMovies, selectedGenre, selectedStaff]);

  const handleFilterByGenre = async (genre: Id<Genre>) => {
    setIsLoadingData(true);
    setSelectedGenre(genre);
    setSelectedStaff(null);
    setSearchQuery("");
    setIsFilterModalOpen(false);
    
    try {
      const filteredMovies = await streamifyClient.getGenreMovies(genre.id);
      setMovies(filteredMovies);
    } catch (error) {
      console.error("Failed to filter by genre:", error);
      alert("Failed to load movies for this genre");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFilterByStaff = async (staff: Id<StaffMember>) => {
    setIsLoadingData(true);
    setSelectedStaff(staff);
    setSelectedGenre(null);
    setSearchQuery("");
    setIsFilterModalOpen(false);
    
    try {
      const staffMovies = await streamifyClient.getStaffMovies(staff.id);
      const filteredMovies = staffMovies.map((sm) => sm.movie);
      setMovies(filteredMovies);
    } catch (error) {
      console.error("Failed to filter by staff:", error);
      alert("Failed to load movies for this staff member");
    } finally {
      setIsLoadingData(false);
    }
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedStaff(null);
    setSearchQuery("");
    setMovies(allMovies);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (!selectedGenre && !selectedStaff) {
      setMovies(allMovies);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMovieClick = (movie: Id<Movie>) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleRatingSubmit = async (movieId: number, rating: number) => {
    // Check if user already has a view for this movie
    const existingView = views.find((v) => v.movie.id === movieId);

    if (existingView) {
      // Update existing view
      await streamifyClient.updateView(movieId, rating);
    } else {
      // Create new view
      await streamifyClient.createView(movieId, rating);
    }

    // Fetch updated movie data
    const updatedMovie = await streamifyClient.getMovieById(movieId);

    // Update the movie in the movies list
    setMovies((prevMovies) =>
      prevMovies.map((m) => (m.id === movieId ? updatedMovie : m))
    );
    setAllMovies((prevMovies) =>
      prevMovies.map((m) => (m.id === movieId ? updatedMovie : m))
    );

    // Refresh views list
    const updatedViews = await streamifyClient.getViews();
    setViews(updatedViews);
  };

  const getExistingRating = (movieId: number): number | undefined => {
    const view = views.find((v) => v.movie.id === movieId);
    return view?.score;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#e50914] tracking-tight">
              STREAMIFY
            </h1>
            
            <div className="flex items-center gap-6">
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Admin Panel
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e50914]/20 flex items-center justify-center border border-[#e50914]/30">
                  <span className="text-[#e50914] font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">
                    {user?.name} {user?.lastName}
                  </p>
                  <p className="text-white/60 text-xs">{user?.email}</p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-white/60 text-lg">
                  Discover and review great movies
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search movies by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-neutral-900/50 border border-white/10 text-white placeholder:text-white/40 rounded-md focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <Button
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </Button>
              {(selectedGenre || selectedStaff || searchQuery) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-[#e50914]/50 text-[#e50914] hover:bg-[#e50914]/10 whitespace-nowrap"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedGenre || selectedStaff) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedGenre && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e50914]/20 border border-[#e50914]/30 rounded-full">
                    <span className="text-[#e50914] text-sm font-medium">
                      Genre: {selectedGenre.name}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedGenre(null);
                        if (!selectedStaff && !searchQuery) {
                          setMovies(allMovies);
                        } else if (!selectedStaff) {
                          setMovies(
                            allMovies.filter((movie) =>
                              movie.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                          );
                        } else {
                          // Keep staff filter active
                        }
                      }}
                      className="text-[#e50914] hover:text-white transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedStaff && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e50914]/20 border border-[#e50914]/30 rounded-full">
                    <span className="text-[#e50914] text-sm font-medium">
                      Staff: {selectedStaff.name} {selectedStaff.lastName}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedStaff(null);
                        if (!selectedGenre && !searchQuery) {
                          setMovies(allMovies);
                        } else if (!selectedGenre) {
                          setMovies(
                            allMovies.filter((movie) =>
                              movie.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                          );
                        } else {
                          // Keep genre filter active
                        }
                      }}
                      className="text-[#e50914] hover:text-white transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white/70 text-sm">Loading movies...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Your Reviews Section - Hidden when searching/filtering */}
              {views.length > 0 && !searchQuery && !selectedGenre && !selectedStaff && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <svg
                      className="w-6 h-6 text-[#e50914]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <h3 className="text-2xl font-bold text-white">Your Reviews</h3>
                    <span className="px-3 py-1 bg-[#e50914]/20 border border-[#e50914]/30 rounded-full text-[#e50914] text-sm font-medium">
                      {views.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {views.map((view) => (
                      <MovieCard
                        key={view.movie.id}
                        movie={view.movie}
                        userScore={view.score}
                        onClick={() => handleMovieClick(view.movie)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Movies Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <svg
                    className="w-6 h-6 text-[#e50914]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedGenre
                      ? `Movies - ${selectedGenre.name}`
                      : selectedStaff
                      ? `Movies - ${selectedStaff.name} ${selectedStaff.lastName}`
                      : searchQuery
                      ? "Search Results"
                      : "All Movies"}
                  </h3>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-white/60 text-sm font-medium">
                    {movies.length}
                  </span>
                </div>

                {movies.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                      <svg
                        className="w-8 h-8 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/60">
                      {searchQuery || selectedGenre || selectedStaff
                        ? "No movies found"
                        : "No movies available yet"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleMovieClick(movie)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {selectedMovie && (
        <MovieRatingModal
          movie={selectedMovie}
          existingRating={getExistingRating(selectedMovie.id)}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleRatingSubmit}
        />
      )}

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Movies</DialogTitle>
            <DialogDescription className="text-white/70">
              Filter movies by genre or staff member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Filter by Genre */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Filter by Genre</h3>
              {isLoadingFilters ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white/60 text-sm">Loading genres...</span>
                  </div>
                </div>
              ) : genres.length === 0 ? (
                <p className="text-white/40 text-sm">No genres available</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleFilterByGenre(genre)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedGenre?.id === genre.id
                          ? "border-[#e50914] bg-[#e50914]/20 text-[#e50914]"
                          : "border-white/10 bg-neutral-800/50 text-white hover:border-white/20 hover:bg-neutral-800"
                      }`}
                    >
                      <span className="text-sm font-medium">{genre.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter by Staff */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Filter by Staff Member</h3>
              {isLoadingFilters ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white/60 text-sm">Loading staff...</span>
                  </div>
                </div>
              ) : staffMembers.length === 0 ? (
                <p className="text-white/40 text-sm">No staff members available</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {staffMembers.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => handleFilterByStaff(staff)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedStaff?.id === staff.id
                          ? "border-[#e50914] bg-[#e50914]/20 text-[#e50914]"
                          : "border-white/10 bg-neutral-800/50 text-white hover:border-white/20 hover:bg-neutral-800"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {staff.name} {staff.lastName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFilterModalOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Close
            </Button>
            {(selectedGenre || selectedStaff) && (
              <Button
                onClick={() => {
                  clearFilters();
                  setIsFilterModalOpen(false);
                }}
                className="bg-[#e50914] hover:bg-[#c4070f] text-white"
              >
                Clear Filters
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
