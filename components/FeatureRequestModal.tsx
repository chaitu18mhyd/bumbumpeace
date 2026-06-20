"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { trackFeatureRequest } from "@/lib/analytics";

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeatureRequestModal({
  isOpen,
  onClose,
}: FeatureRequestModalProps) {
  const [title, setTitle] = useState("City is missing");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feature request");
      }

      trackFeatureRequest(title);
      setSubmitMessage({
        type: "success",
        text: "Thank you! Your feature request has been submitted.",
      });
      setTitle("City is missing");
      setDescription("");

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitMessage(null);
      }, 2000);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to submit feature request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-2xl border border-sand bg-cream p-6 shadow-lg sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted transition hover:bg-sand hover:text-ink"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-ink">Request a Feature</h2>

        {submitMessage && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
              submitMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-ink"
            >
              Request Type
            </label>
            <select
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-sand bg-white px-4 py-2 text-ink transition focus:outline-none focus:ring-2 focus:ring-brand-500"
              disabled={isSubmitting}
            >
              <option value="City is missing">City is missing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-ink"
            >
              Details
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your feature request..."
              className="mt-2 w-full rounded-lg border border-sand bg-white px-4 py-2 text-ink transition placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-sand bg-white px-4 py-2 font-medium text-ink transition hover:bg-sand disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2 font-medium text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
