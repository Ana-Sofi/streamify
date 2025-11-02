import { useAuth } from "../hooks/useAuth";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { streamifyClient } from "../api/streamify-client";
import type { Id, Movie, ViewAggregated } from "../model/streamify.model";
import { MovieCard } from "../components/MovieCard";
import { MovieRatingModal } from "../components/MovieRatingModal";

export function Home() {
  const { isLoading } = useProtectedRoute();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Id<Movie>[]>([]);
  const [views, setViews] = useState<ViewAggregated[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Id<Movie> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, viewsData] = await Promise.all([
          streamifyClient.getMovies(),
          streamifyClient.getViews(),
        ]);
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-white/60 text-lg">
                  Discover and review great movies
                </p>
              </div>
            </div>
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
              {/* Your Reviews Section */}
              {views.length > 0 && (
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

              {/* All Movies Section */}
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
                  <h3 className="text-2xl font-bold text-white">All Movies</h3>
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
                    <p className="text-white/60">No movies available yet</p>
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
    </div>
  );
}
