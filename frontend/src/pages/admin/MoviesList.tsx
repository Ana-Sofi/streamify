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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Movies</h1>
              <p className="text-white/60 text-sm mt-1">
                View, edit, and delete movie records
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/admin/movies/new")}
                className="bg-[#e50914] hover:bg-[#b20710] text-white"
              >
                + Add Movie
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                ← Go Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            <p className="text-white/60 mb-4">No movies found</p>
            <Button
              onClick={() => navigate("/admin/movies/new")}
              className="bg-[#e50914] hover:bg-[#b20710] text-white"
            >
              Add First Movie
            </Button>
          </div>
        ) : (
          <div className="bg-neutral-900/50 border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white font-semibold">ID</TableHead>
                  <TableHead className="text-white font-semibold">Title</TableHead>
                  <TableHead className="text-white font-semibold">Description</TableHead>
                  <TableHead className="text-white font-semibold text-center">Rating</TableHead>
                  <TableHead className="text-white font-semibold text-center">Views</TableHead>
                  <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movies.map((movie) => (
                  <TableRow
                    key={movie.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white/80 font-mono">{movie.id}</TableCell>
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
                          className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(movie)}
                          variant="outline"
                          size="sm"
                          className="border-[#e50914]/50 text-[#e50914] hover:bg-[#e50914]/10 hover:text-[#e50914]"
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
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Movie</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to delete "{deleteConfirm?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              onClick={() => setDeleteConfirm(null)}
              variant="outline"
              disabled={isDeleting}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#e50914] hover:bg-[#b20710] text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Movie Dialog */}
      <Dialog open={!!viewMovie} onOpenChange={() => setViewMovie(null)}>
        <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">{viewMovie?.name}</DialogTitle>
          </DialogHeader>
          {viewMovie && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60">Description</label>
                <p className="text-white mt-1">{viewMovie.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/60">Average Rating</label>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={viewMovie.scoreAverage} size="sm" />
                    <span className="text-white font-medium">
                      {viewMovie.scoreAverage.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60">View Count</label>
                  <p className="text-white font-medium mt-1">{viewMovie.viewCount}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                if (viewMovie) {
                  navigate(`/admin/movies/${viewMovie.id}/edit`);
                }
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setDeleteConfirm(viewMovie);
                setViewMovie(null);
              }}
              className="bg-[#e50914] hover:bg-[#b20710] text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

