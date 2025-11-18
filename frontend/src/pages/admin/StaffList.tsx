import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAdminRoute } from "../../hooks/useAdminRoute";
import { streamifyClient } from "../../api/streamify-client";
import type { StaffMember, Id } from "../../model/streamify.model";
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

export function StaffList() {
  const { isLoading } = useAdminRoute();
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState<Id<StaffMember>[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<StaffMember> | null>(null);
  const [viewStaffMember, setViewStaffMember] = useState<Id<StaffMember> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const data = await streamifyClient.getStaffMembers();
        setStaffMembers(data);
      } catch (error) {
        console.error("Failed to fetch staff members:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchStaffMembers();
    }
  }, [isLoading]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await streamifyClient.deleteStaffMember(deleteConfirm.id);
      setStaffMembers((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete staff member:", error);
      alert("Failed to delete staff member. It may be associated with movies.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStaffMembers = staffMembers.filter((staffMember) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      staffMember.name.toLowerCase().includes(searchLower) ||
      staffMember.lastName.toLowerCase().includes(searchLower) ||
      `${staffMember.name} ${staffMember.lastName}`.toLowerCase().includes(searchLower)
    );
  });

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
              <h1 className="text-2xl font-bold text-white">Manage Staff Members</h1>
            </div>

            <Button
              onClick={() => navigate("/admin/staff/new")}
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
              Add Staff Member
            </Button>
          </div>

          {staffMembers.length > 0 && (
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
                placeholder="Search staff members by name..."
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
              <p className="text-white/70 text-sm">Loading staff members...</p>
            </div>
          </div>
        ) : staffMembers.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Staff Members Yet
            </h3>
            <p className="text-white/60 mb-6">
              Start by adding your first staff member to the database.
            </p>
            <Button
              onClick={() => navigate("/admin/staff/new")}
              className="bg-[#e50914] hover:bg-[#c4070f] text-white font-semibold"
            >
              Add First Staff Member
            </Button>
          </div>
        ) : filteredStaffMembers.length === 0 ? (
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
              No staff members match "{searchQuery}"
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
                    First Name
                  </TableHead>
                  <TableHead className="text-white/70 font-semibold">
                    Last Name
                  </TableHead>
                  <TableHead className="text-white/70 font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffMembers.map((staffMember) => (
                  <TableRow
                    key={staffMember.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-white/90 font-mono">
                      {staffMember.id}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {staffMember.name}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {staffMember.lastName}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setViewStaffMember(staffMember)}
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`/admin/staff/${staffMember.id}/edit`)
                          }
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-white hover:bg-white/5"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(staffMember)}
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
              Are you sure you want to delete "{deleteConfirm?.name} {deleteConfirm?.lastName}"? This
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

      {/* View Staff Member Dialog */}
      <Dialog open={!!viewStaffMember} onOpenChange={() => setViewStaffMember(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {viewStaffMember && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/60">ID</p>
                <p className="text-white font-mono">{viewStaffMember.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">First Name</p>
                <p className="text-white font-medium">{viewStaffMember.name}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Last Name</p>
                <p className="text-white font-medium">{viewStaffMember.lastName}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                navigate(`/admin/staff/${viewStaffMember?.id}/edit`);
                setViewStaffMember(null);
              }}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                setDeleteConfirm(viewStaffMember);
                setViewStaffMember(null);
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

