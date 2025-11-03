import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { streamifyClient } from "../../api/streamify-client";
import type { Genre, Id, Movie } from "../../model/streamify.model";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function GenreForm() {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Movies management
  const [genreMovies, setGenreMovies] = useState<Id<Movie>[]>([]);
  const [allMovies, setAllMovies] = useState<Id<Movie>[]>([]);
  const [selectedMovieToAdd, setSelectedMovieToAdd] = useState<number | null>(null);
  const [isManagingMovies, setIsManagingMovies] = useState(false);
  const [isMovieOperationPending, setIsMovieOperationPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Genre>();

  const loadMovies = async () => {
    if (!id) return;
    try {
      const [assignedMovies, allMoviesData] = await Promise.all([
        streamifyClient.getGenreMovies(parseInt(id)),
        streamifyClient.getMovies(),
      ]);
      setGenreMovies(assignedMovies);
      setAllMovies(allMoviesData);
    } catch (error) {
      console.error("Failed to load movies:", error);
    }
  };

  useEffect(() => {
    const loadGenre = async () => {
      if (!id) return;

      try {
        const genre = await streamifyClient.getGenreById(parseInt(id));
        setValue("name", genre.name);
        await loadMovies();
      } catch (error) {
        console.error("Failed to load genre:", error);
        alert("Failed to load genre");
        navigate("/admin/genres");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading && isEditMode) {
      loadGenre();
    }
  }, [isLoading, id, isEditMode, setValue, navigate]);

  const onSubmit = async (data: Genre) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await streamifyClient.updateGenre(parseInt(id), data);
      } else {
        await streamifyClient.createGenre(data);
      }
      navigate("/admin/genres");
    } catch (error) {
      console.error("Failed to save genre:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} genre`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingData) {
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
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/genres")}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Go Back
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? "Edit Genre" : "Add New Genre"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-neutral-900/30 border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Genre Name *
              </Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Genre name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "Name must not exceed 40 characters",
                  },
                })}
                placeholder="e.g., Action, Drama, Comedy"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-[#e50914] focus:ring-[#e50914]/20"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Genre"
                  : "Create Genre"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/admin/genres")}
                disabled={isSubmitting}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Relationship Management Section - Only show in edit mode */}
          {isEditMode && id && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Manage Movies</h2>
                <Button
                  type="button"
                  onClick={() => {
                    setIsManagingMovies(!isManagingMovies);
                    if (!isManagingMovies) {
                      loadMovies();
                    }
                  }}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  {isManagingMovies ? "Hide Movies" : "Manage Movies"}
                </Button>
              </div>

              {isManagingMovies && (
                <div className="bg-neutral-900/30 border border-white/10 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left: Assigned Movies */}
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3">Assigned Movies</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {genreMovies.length === 0 ? (
                          <p className="text-white/40 text-sm">No movies assigned</p>
                        ) : (
                          genreMovies.map((movie) => (
                            <div
                              key={movie.id}
                              className={`flex items-center justify-between p-2 rounded border ${
                                selectedMovieToAdd === movie.id
                                  ? "border-[#e50914] bg-[#e50914]/10"
                                  : "border-white/10 bg-neutral-800/50"
                              }`}
                            >
                              <span className="text-white">{movie.name}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  if (!id || isMovieOperationPending) return;
                                  setIsMovieOperationPending(true);
                                  try {
                                    await streamifyClient.removeGenreMovie(parseInt(id), movie.id);
                                    await loadMovies();
                                    setSelectedMovieToAdd(null);
                                  } catch (error) {
                                    console.error("Failed to remove movie:", error);
                                    alert("Failed to remove movie");
                                  } finally {
                                    setIsMovieOperationPending(false);
                                  }
                                }}
                                disabled={isMovieOperationPending}
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-7 px-2 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right: Available Movies */}
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3">Available Movies</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allMovies
                          .filter((movie) => !genreMovies.some((gm) => gm.id === movie.id))
                          .length === 0 ? (
                          <p className="text-white/40 text-sm">No movies available</p>
                        ) : (
                          allMovies
                            .filter((movie) => !genreMovies.some((gm) => gm.id === movie.id))
                            .map((movie) => (
                              <div
                                key={movie.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                                  selectedMovieToAdd === movie.id
                                    ? "border-[#e50914] bg-[#e50914]/10"
                                    : "border-white/10 bg-neutral-800/50 hover:border-white/20"
                                }`}
                                onClick={() =>
                                  setSelectedMovieToAdd(
                                    selectedMovieToAdd === movie.id ? null : movie.id
                                  )
                                }
                              >
                                <span className="text-white">{movie.name}</span>
                              </div>
                            ))
                        )}
                      </div>
                      {selectedMovieToAdd && (
                        <div className="mt-4">
                          <Button
                            type="button"
                            onClick={async () => {
                              if (!id || isMovieOperationPending) return;
                              setIsMovieOperationPending(true);
                              try {
                                await streamifyClient.addGenreMovie(parseInt(id), selectedMovieToAdd);
                                await loadMovies();
                                setSelectedMovieToAdd(null);
                              } catch (error) {
                                console.error("Failed to add movie:", error);
                                alert("Failed to add movie");
                              } finally {
                                setIsMovieOperationPending(false);
                              }
                            }}
                            disabled={isMovieOperationPending}
                            className="bg-[#e50914] hover:bg-[#c4070f] text-white w-full"
                          >
                            {isMovieOperationPending ? "Adding..." : "Add Movie"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

