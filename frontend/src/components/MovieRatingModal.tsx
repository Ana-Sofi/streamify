import { useState } from "react";
import type { Id, Movie } from "../model/streamify.model";
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
      <DialogContent className="sm:max-w-[600px] bg-neutral-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">{movie.name}</DialogTitle>
          <DialogDescription className="text-white/60 text-base">
            {movie.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <p className="text-white text-lg mb-6 text-center">
            What do you think of this movie?
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-white bg-[#e50914]/20 border border-[#e50914]/50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <StarRatingInput value={rating} onChange={setRating} size="lg" />
          </div>

          {rating > 0 && (
            <p className="text-center text-white/60 text-sm">
              You rated this movie {rating} star{rating !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleMarkAsViewed}
            disabled={isSubmitting}
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            {isSubmitting ? "Submitting..." : "Mark as Viewed"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-[#e50914] hover:bg-[#b20710] text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

