import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { streamifyClient } from "../../api/streamify-client";
import type { StaffMember } from "../../model/streamify.model";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StaffMember>();

  useEffect(() => {
    const loadStaffMember = async () => {
      if (!id) return;

      try {
        const staffMember = await streamifyClient.getStaffMemberById(parseInt(id));
        setValue("name", staffMember.name);
        setValue("lastName", staffMember.lastName);
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
        </div>
      </main>
    </div>
  );
}

