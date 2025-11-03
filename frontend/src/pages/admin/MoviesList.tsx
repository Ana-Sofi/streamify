import { useEffect, useState } from "react";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { streamifyClient } from "../../api/streamify-client";
import type { Id, Movie } from "../../model/streamify.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StarRating } from "../../components/StarRating";

export function MoviesList() {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Id<Movie>[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<Movie> | null>(null);
  const [viewMovie, setViewMovie] = useState<Id<Movie> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await streamifyClient.getMovies();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchMovies();
    }
  }, [isLoading]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await streamifyClient.deleteMovie(deleteConfirm.id);
      setMovies((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Failed to delete movie. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin")}
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
              <h1 className="text-2xl font-bold text-white">Manage Movies</h1>
            </div>
            
            <Button
              onClick={() => navigate("/admin/movies/new")}
              className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Movie
            </Button>
          </div>

          {movies.length > 0 && (
            <div className="relative">
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
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/50 border border-white/10 text-white placeholder:text-white/40 rounded-md focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/70 text-sm">Loading movies...</p>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="w-16 h-16 text-white/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Movies Yet
            </h3>
            <p className="text-white/60 mb-6">
              Start by adding your first movie to the catalog.
            </p>
            <Button
              onClick={() => navigate("/admin/movies/new")}
              className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold"
            >
              Add First Movie
            </Button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="w-16 h-16 text-white/20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Results Found
            </h3>
            <p className="text-white/60 mb-4">
              No movies match "{searchQuery}"
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="bg-neutral-900/30 border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70 font-semibold">ID</TableHead>
                  <TableHead className="text-white/70 font-semibold">Title</TableHead>
                  <TableHead className="text-white/70 font-semibold">Description</TableHead>
                  <TableHead className="text-white/70 font-semibold text-center">Rating</TableHead>
                  <TableHead className="text-white/70 font-semibold text-center">Views</TableHead>
                  <TableHead className="text-white/70 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <TableRow
                    key={movie.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white/90 font-mono">
                      {movie.id}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {movie.name}
                    </TableCell>
                    <TableCell className="text-white/60 max-w-md truncate">
                      {movie.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <StarRating rating={movie.scoreAverage} size="sm" />
                        <span className="text-white/60 text-sm">
                          {movie.scoreAverage.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/60 text-center">
                      {movie.viewCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setViewMovie(movie)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(movie)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete "{deleteConfirm?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={isDeleting}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Movie Dialog */}
      <Dialog open={!!viewMovie} onOpenChange={() => setViewMovie(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Movie Details</DialogTitle>
          </DialogHeader>
          {viewMovie && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">ID</p>
                <p className="text-white font-mono">{viewMovie.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Title</p>
                <p className="text-white font-medium">{viewMovie.name}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Description</p>
                <p className="text-white">{viewMovie.description}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={viewMovie.scoreAverage} size="sm" />
                  <span className="text-white font-medium">
                    {viewMovie.scoreAverage.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/60">View Count</p>
                <p className="text-white font-medium">{viewMovie.viewCount}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                navigate(`/admin/movies/${viewMovie?.id}/edit`);
                setViewMovie(null);
              }}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setDeleteConfirm(viewMovie);
                setViewMovie(null);
              }}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

