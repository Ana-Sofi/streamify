import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { streamifyClient } from "../../api/streamify-client";
import type { Genre, Id } from "../../model/streamify.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export function GenresList() {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Id<Genre>[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<Genre> | null>(null);
  const [viewGenre, setViewGenre] = useState<Id<Genre> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await streamifyClient.getGenres();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchGenres();
    }
  }, [isLoading]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await streamifyClient.deleteGenre(deleteConfirm.id);
      setGenres((prev) => prev.filter((g) => g.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete genre:", error);
      alert("Failed to delete genre. It may be associated with movies.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen bg-neutral-950">
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
              <h1 className="text-2xl font-bold text-white">Manage Genres</h1>
            </div>

            <Button
              onClick={() => navigate("/admin/genres/new")}
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
              Add Genre
            </Button>
          </div>

          {genres.length > 0 && (
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
                placeholder="Search genres by name..."
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/70 text-sm">Loading genres...</p>
            </div>
          </div>
        ) : genres.length === 0 ? (
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Genres Yet
            </h3>
            <p className="text-white/60 mb-6">
              Start by adding your first genre to organize your movies.
            </p>
            <Button
              onClick={() => navigate("/admin/genres/new")}
              className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold"
            >
              Add First Genre
            </Button>
          </div>
        ) : filteredGenres.length === 0 ? (
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
              No genres match "{searchQuery}"
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
                  <TableHead className="text-white/70 font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="text-white/70 font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-white/70 font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGenres.map((genre) => (
                  <TableRow
                    key={genre.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white/90 font-mono">
                      {genre.id}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {genre.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setViewGenre(genre)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`/admin/genres/${genre.id}/edit`)
                          }
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(genre)}
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

      {/* View Genre Dialog */}
      <Dialog open={!!viewGenre} onOpenChange={() => setViewGenre(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Genre Details</DialogTitle>
          </DialogHeader>
          {viewGenre && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">ID</p>
                <p className="text-white font-mono">{viewGenre.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-white font-medium">{viewGenre.name}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                navigate(`/admin/genres/${viewGenre?.id}/edit`);
                setViewGenre(null);
              }}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setDeleteConfirm(viewGenre);
                setViewGenre(null);
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

