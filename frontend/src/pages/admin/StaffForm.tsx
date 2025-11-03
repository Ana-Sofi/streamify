import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { streamifyClient } from "../../api/streamify-client";
import type { StaffMember, Id, Movie, StaffMovieAggregated } from "../../model/streamify.model";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function StaffForm() {
  const { isLoading } = useProtectedRoute();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Movies management
  const [staffMovies, setStaffMovies] = useState<StaffMovieAggregated[]>([]);
  const [allMovies, setAllMovies] = useState<Id<Movie>[]>([]);
  const [selectedMovieToAdd, setSelectedMovieToAdd] = useState<number | null>(null);
  const [selectedMovieToRemove, setSelectedMovieToRemove] = useState<number | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const [selectedMovieRole, setSelectedMovieRole] = useState<{ id: number; roleName: string } | null>(null);
  const [isManagingMovies, setIsManagingMovies] = useState(false);
  const [isMovieOperationPending, setIsMovieOperationPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StaffMember>();

  const loadMovies = async () => {
    if (!id) return;
    try {
      const [assignedMovies, allMoviesData] = await Promise.all([
        streamifyClient.getStaffMovies(parseInt(id)),
        streamifyClient.getMovies(),
      ]);
      setStaffMovies(assignedMovies);
      setAllMovies(allMoviesData);
    } catch (error) {
      console.error("Failed to load movies:", error);
    }
  };

  useEffect(() => {
    const loadStaffMember = async () => {
      if (!id) return;

      try {
        const staffMember = await streamifyClient.getStaffMemberById(parseInt(id));
        setValue("name", staffMember.name);
        setValue("lastName", staffMember.lastName);
        await loadMovies();
      } catch (error) {
        console.error("Failed to load staff member:", error);
        alert("Failed to load staff member");
        navigate("/admin/staff");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading && isEditMode) {
      loadStaffMember();
    }
  }, [isLoading, id, isEditMode, setValue, navigate]);

  const onSubmit = async (data: StaffMember) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await streamifyClient.updateStaffMember(parseInt(id), data);
      } else {
        await streamifyClient.createStaffMember(data);
      }
      navigate("/admin/staff");
    } catch (error) {
      console.error("Failed to save staff member:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} staff member`);
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
              onClick={() => navigate("/admin/staff")}
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
              {isEditMode ? "Edit Staff Member" : "Add New Staff Member"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-neutral-900/30 border border-white/10 rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                First Name *
              </Label>
              <Input
                id="name"
                {...register("name", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "First name must not exceed 50 characters",
                  },
                })}
                placeholder="e.g., John"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-[#e50914] focus:ring-[#e50914]/20"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Last name must not exceed 50 characters",
                  },
                })}
                placeholder="e.g., Doe"
                className="bg-neutral-900/50 border-white/10 text-white placeholder:text-white/40 focus:border-[#e50914] focus:ring-[#e50914]/20"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">{errors.lastName.message}</p>
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
                  ? "Update Staff Member"
                  : "Create Staff Member"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/admin/staff")}
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
                      setRoleName("");
                      setSelectedMovieToAdd(null);
                      setSelectedMovieToRemove(null);
                      setSelectedMovieRole(null);
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
                        {staffMovies.length === 0 ? (
                          <p className="text-white/40 text-sm">No movies assigned</p>
                        ) : (
                          staffMovies.map((staffMovie) => (
                            <div
                              key={staffMovie.id}
                              className={`flex flex-col gap-2 p-2 rounded border ${
                                selectedMovieToRemove === staffMovie.id
                                  ? "border-[#e50914] bg-[#e50914]/10"
                                  : "border-white/10 bg-neutral-800/50"
                              }`}
                              onClick={() => {
                                setSelectedMovieToRemove(
                                  selectedMovieToRemove === staffMovie.id ? null : staffMovie.id
                                );
                                setSelectedMovieRole(
                                  selectedMovieToRemove === staffMovie.id
                                    ? null
                                    : { id: staffMovie.id, roleName: staffMovie.roleName }
                                );
                                setSelectedMovieToAdd(null);
                                setRoleName("");
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-white">{staffMovie.movie.name}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!id || isMovieOperationPending) return;
                                    setIsMovieOperationPending(true);
                                    try {
                                      await streamifyClient.removeStaffMovie(parseInt(id), staffMovie.id);
                                      await loadMovies();
                                      setSelectedMovieToRemove(null);
                                      setSelectedMovieRole(null);
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
                              {selectedMovieToRemove === staffMovie.id && (
                                <div>
                                  <Label className="text-xs text-white/60">Role</Label>
                                  <Input
                                    value={selectedMovieRole?.roleName || ""}
                                    onChange={(e) => {
                                      setSelectedMovieRole({
                                        id: staffMovie.id,
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

                    {/* Right: Available Movies */}
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-3">Available Movies</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {allMovies
                          .filter(
                            (movie) => !staffMovies.some((sm) => sm.movie.id === movie.id)
                          )
                          .length === 0 ? (
                          <p className="text-white/40 text-sm">No movies available</p>
                        ) : (
                          allMovies
                            .filter(
                              (movie) => !staffMovies.some((sm) => sm.movie.id === movie.id)
                            )
                            .map((movie) => (
                              <div
                                key={movie.id}
                                className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                                  selectedMovieToAdd === movie.id
                                    ? "border-[#e50914] bg-[#e50914]/10"
                                    : "border-white/10 bg-neutral-800/50 hover:border-white/20"
                                }`}
                                onClick={() => {
                                  setSelectedMovieToAdd(
                                    selectedMovieToAdd === movie.id ? null : movie.id
                                  );
                                  setSelectedMovieToRemove(null);
                                  setSelectedMovieRole(null);
                                  if (selectedMovieToAdd !== movie.id) {
                                    setRoleName("");
                                  }
                                }}
                              >
                                <span className="text-white">{movie.name}</span>
                              </div>
                            ))
                        )}
                      </div>
                      {selectedMovieToAdd && (
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
                              if (!id || isMovieOperationPending || !roleName.trim()) {
                                if (!roleName.trim()) {
                                  alert("Role name is required");
                                }
                                return;
                              }
                              setIsMovieOperationPending(true);
                              try {
                                await streamifyClient.addStaffMovie(
                                  parseInt(id),
                                  selectedMovieToAdd,
                                  roleName.trim()
                                );
                                await loadMovies();
                                setSelectedMovieToAdd(null);
                                setRoleName("");
                              } catch (error) {
                                console.error("Failed to add movie:", error);
                                alert("Failed to add movie");
                              } finally {
                                setIsMovieOperationPending(false);
                              }
                            }}
                            disabled={isMovieOperationPending || !roleName.trim()}
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

