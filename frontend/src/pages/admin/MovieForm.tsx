import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router";
import { streamifyClient } from "../../api/streamify-client";
import type { Movie } from "../../model/streamify.model";

type MovieFormData = {
  name: string;
  description: string;
};

export function MovieForm() {
  const { isLoading } = useProtectedRoute();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MovieFormData>();

  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const movie = await streamifyClient.getMovieById(parseInt(id));
        setValue("name", movie.name);
        setValue("description", movie.description);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setError("Failed to load movie data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading && isEdit) {
      fetchMovie();
    }
  }, [isLoading, id, isEdit, setValue]);

  const onSubmit: SubmitHandler<MovieFormData> = async (data) => {
    setError("");
    setIsSubmitting(true);

    try {
      if (isEdit && id) {
        await streamifyClient.updateMovie(parseInt(id), data);
      } else {
        await streamifyClient.createMovie(data);
      }
      navigate("/admin/movies");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "create"} movie`
      );
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-2xl font-bold text-white">
                {isEdit ? "Edit Movie" : "Create New Movie"}
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {isEdit ? "Update movie information" : "Add a new movie to the catalog"}
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/movies")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              ← Go Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-white bg-[#e50914]/20 border border-[#e50914]/50 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-sm font-medium">
                Movie Title *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter movie title"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#e50914] focus:ring-[#e50914]/20"
                {...register("name", {
                  required: "Movie title is required",
                  minLength: {
                    value: 1,
                    message: "Title must be at least 1 character",
                  },
                  maxLength: {
                    value: 32,
                    message: "Title must not exceed 32 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-[#e50914]">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white text-sm font-medium">
                Description *
              </Label>
              <textarea
                id="description"
                rows={6}
                placeholder="Enter movie description"
                className="w-full bg-neutral-900/50 border border-white/10 text-white placeholder:text-white/40 rounded-md px-3 py-2 focus:border-[#e50914] focus:ring-2 focus:ring-[#e50914]/20 focus:outline-none"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              {errors.description && (
                <p className="text-sm text-[#e50914]">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#e50914] hover:bg-[#b20710] text-white px-8"
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Movie"
                  : "Create Movie"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/admin/movies")}
                variant="outline"
                disabled={isSubmitting}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

