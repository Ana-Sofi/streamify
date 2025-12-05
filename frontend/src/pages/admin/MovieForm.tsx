import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAdminRoute } from "../../hooks/useAdminRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router";
import { streamifyClient } from "../../api/streamify-client";
import type { Id, Genre, StaffMember, MovieStaffAggregated } from "../../model/streamify.model";

type MovieFormData = {
  name: string;
  description: string;
  imageUrl?: string;
};

export function MovieForm() {
  const { isLoading } = useAdminRoute();
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

  // Genres management
  const [movieGenres, setMovieGenres] = useState<Id<Genre>[]>([]);
  const [allGenres, setAllGenres] = useState<Id<Genre>[]>([]);
  const [selectedGenreToAdd, setSelectedGenreToAdd] = useState<number | null>(null);
  const [isManagingGenres, setIsManagingGenres] = useState(false);
  const [isGenreOperationPending, setIsGenreOperationPending] = useState(false);

  // Staff management
  const [movieStaff, setMovieStaff] = useState<MovieStaffAggregated[]>([]);
  const [allStaff, setAllStaff] = useState<Id<StaffMember>[]>([]);
  const [selectedStaffToAdd, setSelectedStaffToAdd] = useState<number | null>(null);
  const [selectedStaffToRemove, setSelectedStaffToRemove] = useState<number | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [selectedStaffRole, setSelectedStaffRole] = useState<{ id: number; roleName: string } | null>(null);
  const [isManagingStaff, setIsManagingStaff] = useState(false);
  const [isStaffOperationPending, setIsStaffOperationPending] = useState(false);

  const loadGenres = async () => {
    if (!id) return;
    try {
      const [assignedGenres, allGenresData] = await Promise.all([
        streamifyClient.getMovieGenres(parseInt(id)),
        streamifyClient.getGenres(),
      ]);
      setMovieGenres(assignedGenres);
      setAllGenres(allGenresData);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  };

  const loadStaff = async () => {
    if (!id) return;
    try {
      const [assignedStaff, allStaffData] = await Promise.all([
        streamifyClient.getMovieStaff(parseInt(id)),
        streamifyClient.getStaffMembers(),
      ]);
      setMovieStaff(assignedStaff);
      setAllStaff(allStaffData);
    } catch (error) {
      console.error("Failed to load staff:", error);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const movie = await streamifyClient.getMovieById(parseInt(id));
        setValue("name", movie.name);
        setValue("description", movie.description);
        setValue("imageUrl", movie.imageUrl || "");
        await Promise.all([loadGenres(), loadStaff()]);
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
      // Clean up imageUrl: if empty string, set to undefined
      const movieData = {
        ...data,
        imageUrl: data.imageUrl?.trim() || undefined,
      };

      if (isEdit && id) {
        await streamifyClient.updateMovie(parseInt(id), movieData);
      } else {
        await streamifyClient.createMovie(movieData);
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/movies")}
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
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isEdit ? "Edit Movie" : "Create New Movie"}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {isEdit ? "Update movie information" : "Add a new movie to the catalog"}
                </p>
              </div>
            </div>
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

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-white text-sm font-medium">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-[#e50914] focus:ring-[#e50914]/20"
                {...register("imageUrl", {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Please enter a valid URL starting with http:// or https://",
                  },
                })}
              />
              {errors.imageUrl && (
                <p className="text-sm text-[#e50914]">{errors.imageUrl.message}</p>
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

          {/* Relationship Management Sections - Only show in edit mode */}
          {isEdit && id && (
            <div className="mt-8 space-y-8">
              {/* Genres Management Section */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Manage Genres</h2>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsManagingGenres(!isManagingGenres);
                      if (!isManagingGenres) {
                        loadGenres();
                      }
                    }}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    {isManagingGenres ? "Hide Genres" : "Manage Genres"}
                  </Button>
                </div>

                {isManagingGenres && (
                  <div className="bg-neutral-900/30 border border-white/10 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left: Assigned Genres */}
                      <div>
                        <h3 className="text-sm font-medium text-white/70 mb-3">Assigned Genres</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {movieGenres.length === 0 ? (
                            <p className="text-white/40 text-sm">No genres assigned</p>
                          ) : (
                            movieGenres.map((genre) => (
                              <div
                                key={genre.id}
                                className={`flex items-center justify-between p-2 rounded border ${selectedGenreToAdd === genre.id
                                  ? "border-[#e50914] bg-[#e50914]/10"
                                  : "border-white/10 bg-neutral-800/50"
                                  }`}
                              >
                                <span className="text-white">{genre.name}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    if (!id || isGenreOperationPending) return;
                                    setIsGenreOperationPending(true);
                                    try {
                                      await streamifyClient.removeMovieGenre(parseInt(id), genre.id);
                                      await loadGenres();
                                      setSelectedGenreToAdd(null);
                                    } catch (error) {
                                      console.error("Failed to remove genre:", error);
                                      alert("Failed to remove genre");
                                    } finally {
                                      setIsGenreOperationPending(false);
                                    }
                                  }}
                                  disabled={isGenreOperationPending}
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-7 px-2 text-xs"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Available Genres */}
                      <div>
                        <h3 className="text-sm font-medium text-white/70 mb-3">Available Genres</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {allGenres
                            .filter((genre) => !movieGenres.some((mg) => mg.id === genre.id))
                            .length === 0 ? (
                            <p className="text-white/40 text-sm">No genres available</p>
                          ) : (
                            allGenres
                              .filter((genre) => !movieGenres.some((mg) => mg.id === genre.id))
                              .map((genre) => (
                                <div
                                  key={genre.id}
                                  className={`flex items-center justify-between p-2 rounded border cursor-pointer ${selectedGenreToAdd === genre.id
                                    ? "border-[#e50914] bg-[#e50914]/10"
                                    : "border-white/10 bg-neutral-800/50 hover:border-white/20"
                                    }`}
                                  onClick={() =>
                                    setSelectedGenreToAdd(
                                      selectedGenreToAdd === genre.id ? null : genre.id
                                    )
                                  }
                                >
                                  <span className="text-white">{genre.name}</span>
                                </div>
                              ))
                          )}
                        </div>
                        {selectedGenreToAdd && (
                          <div className="mt-4">
                            <Button
                              type="button"
                              onClick={async () => {
                                if (!id || isGenreOperationPending) return;
                                setIsGenreOperationPending(true);
                                try {
                                  await streamifyClient.addMovieGenre(parseInt(id), selectedGenreToAdd);
                                  await loadGenres();
                                  setSelectedGenreToAdd(null);
                                } catch (error) {
                                  console.error("Failed to add genre:", error);
                                  alert("Failed to add genre");
                                } finally {
                                  setIsGenreOperationPending(false);
                                }
                              }}
                              disabled={isGenreOperationPending}
                              className="bg-[#e50914] hover:bg-[#c4070f] text-white w-full"
                            >
                              {isGenreOperationPending ? "Adding..." : "Add Genre"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Staff Management Section */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Manage Staff</h2>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsManagingStaff(!isManagingStaff);
                      if (!isManagingStaff) {
                        loadStaff();
                        setRoleName("");
                        setSelectedStaffToAdd(null);
                        setSelectedStaffToRemove(null);
                        setSelectedStaffRole(null);
                      }
                    }}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    {isManagingStaff ? "Hide Staff" : "Manage Staff"}
                  </Button>
                </div>

                {isManagingStaff && (
                  <div className="bg-neutral-900/30 border border-white/10 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left: Assigned Staff */}
                      <div>
                        <h3 className="text-sm font-medium text-white/70 mb-3">Assigned Staff</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {movieStaff.length === 0 ? (
                            <p className="text-white/40 text-sm">No staff assigned</p>
                          ) : (
                            movieStaff.map((staff) => (
                              <div
                                key={staff.id}
                                className={`flex flex-col gap-2 p-2 rounded border ${selectedStaffToRemove === staff.id
                                  ? "border-[#e50914] bg-[#e50914]/10"
                                  : "border-white/10 bg-neutral-800/50"
                                  }`}
                                onClick={() => {
                                  setSelectedStaffToRemove(
                                    selectedStaffToRemove === staff.id ? null : staff.id
                                  );
                                  setSelectedStaffRole(
                                    selectedStaffToRemove === staff.id
                                      ? null
                                      : { id: staff.id, roleName: staff.roleName }
                                  );
                                  setSelectedStaffToAdd(null);
                                  setRoleName("");
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white">
                                    {staff.member.name} {staff.member.lastName}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (!id || isStaffOperationPending) return;
                                      setIsStaffOperationPending(true);
                                      try {
                                        await streamifyClient.removeMovieStaff(parseInt(id), staff.id);
                                        await loadStaff();
                                        setSelectedStaffToRemove(null);
                                        setSelectedStaffRole(null);
                                      } catch (error) {
                                        console.error("Failed to remove staff:", error);
                                        alert("Failed to remove staff");
                                      } finally {
                                        setIsStaffOperationPending(false);
                                      }
                                    }}
                                    disabled={isStaffOperationPending}
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-7 px-2 text-xs"
                                  >
                                    Remove
                                  </Button>
                                </div>
                                {selectedStaffToRemove === staff.id && (
                                  <div>
                                    <Label className="text-xs text-white/60">Role</Label>
                                    <Input
                                      value={selectedStaffRole?.roleName || ""}
                                      onChange={(e) => {
                                        setSelectedStaffRole({
                                          id: staff.id,
                                          roleName: e.target.value,
                                        });
                                      }}
                                      placeholder="Role name"
                                      className="bg-neutral-900/50 border-white/10 text-white text-sm h-8"
                                    />
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right: Available Staff */}
                      <div>
                        <h3 className="text-sm font-medium text-white/70 mb-3">Available Staff</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {allStaff
                            .filter(
                              (staff) => !movieStaff.some((ms) => ms.member.id === staff.id)
                            )
                            .length === 0 ? (
                            <p className="text-white/40 text-sm">No staff available</p>
                          ) : (
                            allStaff
                              .filter(
                                (staff) => !movieStaff.some((ms) => ms.member.id === staff.id)
                              )
                              .map((staff) => (
                                <div
                                  key={staff.id}
                                  className={`flex items-center justify-between p-2 rounded border cursor-pointer ${selectedStaffToAdd === staff.id
                                    ? "border-[#e50914] bg-[#e50914]/10"
                                    : "border-white/10 bg-neutral-800/50 hover:border-white/20"
                                    }`}
                                  onClick={() => {
                                    setSelectedStaffToAdd(
                                      selectedStaffToAdd === staff.id ? null : staff.id
                                    );
                                    setSelectedStaffToRemove(null);
                                    setSelectedStaffRole(null);
                                    if (selectedStaffToAdd !== staff.id) {
                                      setRoleName("");
                                    }
                                  }}
                                >
                                  <span className="text-white">
                                    {staff.name} {staff.lastName}
                                  </span>
                                </div>
                              ))
                          )}
                        </div>
                        {selectedStaffToAdd && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <Label className="text-xs text-white/60">Role Name *</Label>
                              <Input
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="e.g., Director, Actor, Producer"
                                className="bg-neutral-900/50 border-white/10 text-white text-sm"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={async () => {
                                if (!id || isStaffOperationPending || !roleName.trim()) {
                                  if (!roleName.trim()) {
                                    alert("Role name is required");
                                  }
                                  return;
                                }
                                setIsStaffOperationPending(true);
                                try {
                                  await streamifyClient.addMovieStaff(
                                    parseInt(id),
                                    selectedStaffToAdd,
                                    roleName.trim()
                                  );
                                  await loadStaff();
                                  setSelectedStaffToAdd(null);
                                  setRoleName("");
                                } catch (error) {
                                  console.error("Failed to add staff:", error);
                                  alert("Failed to add staff");
                                } finally {
                                  setIsStaffOperationPending(false);
                                }
                              }}
                              disabled={isStaffOperationPending || !roleName.trim()}
                              className="bg-[#e50914] hover:bg-[#c4070f] text-white w-full"
                            >
                              {isStaffOperationPending ? "Adding..." : "Add Staff"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

