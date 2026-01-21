import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DeleteAccount = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/auth/delete-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to delete account");
      }

      // Clear local auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
      }

      toast.success("Account deleted successfully");
      setShowConfirmDialog(false);
      router.push("/");
      // Ensure UI fully resets
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Account Deletion</h1>
      </div>

      <div className="max-w-2xl">
        <p className="text-gray-700 mb-6 leading-relaxed">
          Once you've deleted your account, you will no longer be able to log in
          to the Naibrly site or apps. This action cannot be undone.
        </p>

        <Button
          onClick={handleDeleteClick}
          variant="outline"
          className="px-6 text-teal-700 border-teal-600 hover:bg-teal-50"
        >
          Delete Account
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Account Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and you will lose all your data.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
