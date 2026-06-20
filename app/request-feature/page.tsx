"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function RequestFeaturePage() {
  const [title, setTitle] = useState("City is missing");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to submit feature request");
      }

      setSubmitMessage({
        type: "success",
        text: "Thank you! Your feature request has been submitted.",
      });
      setTitle("City is missing");
      setDescription("");
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to submit feature request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 text-ink">
        <MessageSquare className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold">Request a Feature</h1>
          <p className="mt-1 text-sm text-muted">
            Tell us what city or improvement you want to see next.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-sand bg-cream p-6 shadow-sm sm:p-8">
        {submitMessage && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
              submitMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-ink"
            >
              Request type
            </label>
            <select
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand-200"
              disabled={isSubmitting}
            >
              <option value="City is missing">City is missing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-ink"
            >
              Details
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              placeholder="Describe the city or feature you want us to add..."
              className="mt-3 w-full rounded-3xl border border-sand bg-white px-4 py-3 text-ink shadow-sm focus:border-ink focus:outline-none focus:ring-2 focus:ring-brand-200"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-3xl border border-sand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
            >
              Back home
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
