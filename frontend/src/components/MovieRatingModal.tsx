import { useState, useEffect } from "react";
import type { Id, Movie, Genre, MovieStaffAggregated } from "../model/streamify.model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "./StarRatingInput";
import { streamifyClient } from "../api/streamify-client";

interface MovieRatingModalProps {
  movie: Id<Movie>;
  existingRating?: number; // If user has already rated this movie
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (movieId: number, rating: number) => Promise<void>;
}

export function MovieRatingModal({
  movie,
  existingRating,
  open,
  onOpenChange,
  onSubmit,
}: MovieRatingModalProps) {
  const [rating, setRating] = useState<number>(existingRating ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [genres, setGenres] = useState<Id<Genre>[]>([]);
  const [staff, setStaff] = useState<MovieStaffAggregated[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    setRating(existingRating ?? 0);
  }, [existingRating]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!open || !movie.id) return;

      setIsLoadingDetails(true);
      try {
        const [genresData, staffData] = await Promise.all([
          streamifyClient.getMovieGenres(movie.id),
          streamifyClient.getMovieStaff(movie.id),
        ]);
        setGenres(genresData);
        setStaff(staffData);
      } catch (error) {
        console.error("Failed to load movie details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    loadMovieDetails();
  }, [open, movie.id]);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(movie.id, rating);
      onOpenChange(false);
      // Reset rating for next time
      setRating(existingRating ?? 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit rating"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsViewed = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(movie.id, 0);
      onOpenChange(false);
      setRating(existingRating ?? 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark as viewed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-neutral-900 border-white/10 p-0">
        {/* Banner Placeholder */}
        <div className="relative w-full h-64 bg-gradient-to-b from-neutral-800 to-neutral-900">
          {movie.imageUrl ? (
            <>
              <img
                src={movie.imageUrl}
                alt={movie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-neutral-800/50 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-white/20"
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
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </>
          )}
        </div>

        <div className="px-8 pb-8">
          {/* Header */}
          <DialogHeader className="pt-6 pb-4">
            <DialogTitle className="text-4xl font-bold text-white mb-3">
              {movie.name}
            </DialogTitle>
            <DialogDescription className="text-white/70 text-lg leading-relaxed">
              {movie.description}
            </DialogDescription>
          </DialogHeader>

          {/* Genres and Staff Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Genres */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
                Genres
              </h3>
              {isLoadingDetails ? (
                <div className="flex items-center gap-2 text-white/40">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              ) : genres.length === 0 ? (
                <p className="text-white/40 text-sm">No genres assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1.5 bg-[#e50914]/20 border border-[#e50914]/30 rounded-full text-[#e50914] text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
                Cast & Crew
              </h3>
              {isLoadingDetails ? (
                <div className="flex items-center gap-2 text-white/40">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              ) : staff.length === 0 ? (
                <p className="text-white/40 text-sm">No staff assigned</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {staff.map((staffMember) => (
                    <div
                      key={staffMember.id}
                      className="flex items-center justify-between p-2 rounded border border-white/10 bg-neutral-800/30"
                    >
                      <span className="text-white text-sm">
                        {staffMember.member.name} {staffMember.member.lastName}
                      </span>
                      <span className="text-white/60 text-xs px-2 py-1 bg-white/5 rounded">
                        {staffMember.roleName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-white text-xl font-semibold mb-6 text-center">
              What do you think of this movie?
            </p>

            {error && (
              <div className="mb-4 p-3 text-sm text-white bg-[#e50914]/20 border border-[#e50914]/50 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-center mb-6">
              <StarRatingInput value={rating} onChange={setRating} size="lg" />
            </div>

            {rating > 0 && (
              <p className="text-center text-white/60 text-sm mb-6">
                You rated this movie {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleMarkAsViewed}
              disabled={isSubmitting}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Mark as Viewed"}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="bg-[#e50914] hover:bg-[#b20710] text-white w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

