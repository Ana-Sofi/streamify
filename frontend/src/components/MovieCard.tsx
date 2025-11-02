import type { Id, Movie } from "../model/streamify.model";
import { StarRating } from "./StarRating";

interface MovieCardProps {
  movie: Id<Movie>;
  userScore?: number; // If provided, shows "Your Rating" instead of average
}

export function MovieCard({ movie, userScore }: MovieCardProps) {
  const displayScore = userScore ?? movie.scoreAverage;
  const scoreLabel = userScore !== undefined ? "Your Rating" : "Average Rating";

  return (
    <div className="group bg-neutral-900/50 border border-white/10 rounded-lg overflow-hidden hover:border-[#e50914]/50 transition-all duration-300">
      {/* Placeholder Image */}
      <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e50914]/10 to-transparent"></div>
        <svg
          className="w-20 h-20 text-white/10 relative z-10"
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
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
          {movie.name}
        </h3>
        
        <p className="text-white/60 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {movie.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <StarRating rating={displayScore} size="sm" />
            <span className="text-[#e50914] font-medium">
              {displayScore.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-white/60">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{movie.viewCount}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/40 text-xs">{scoreLabel}</p>
        </div>
      </div>
    </div>
  );
}

