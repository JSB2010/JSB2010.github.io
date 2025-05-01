"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Star } from "lucide-react";
import { firebaseApp } from "@/lib/firebase/config";
import { trackEvent } from "@/lib/firebase/analytics";

// Form validation schema
const formSchema = z.object({
  rating: z.string().min(1).max(1),
  feedback: z.string().min(5, { message: "Feedback must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFeedbackProps {
  projectId: string;
  projectName: string;
}

export function ProjectFeedback({ projectId, projectName }: ProjectFeedbackProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: "",
      feedback: "",
    },
  });

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating.toString());
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Get Firebase Functions instance
      const functions = getFunctions(firebaseApp);

      // Call the submitProjectFeedback function
      const submitProjectFeedback = httpsCallable(functions, 'submitProjectFeedback');

      // Submit the feedback data
      await submitProjectFeedback({
        projectId,
        rating: data.rating,
        feedback: data.feedback,
      });

      // Track event in analytics
      await trackEvent("project_feedback_submitted", {
        project_id: projectId,
        project_name: projectName,
        rating: parseInt(data.rating),
      });

      // Show success message
      setIsSuccess(true);

      // Reset form
      reset();
      setSelectedRating(null);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("There was an error submitting your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-4 sm:p-6 border border-border rounded-lg bg-card">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Project Feedback</h3>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">How would you rate this project?</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  aria-label={`Rate ${rating} out of 5 stars`}
                  title={`Rate ${rating} out of 5 stars`}
                  className={`p-1.5 rounded-md transition-colors ${
                    selectedRating && selectedRating >= rating
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                >
                  <Star className="h-6 w-6" fill={selectedRating && selectedRating >= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-xs text-red-500 mt-1">Please select a rating</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="feedback" className="text-sm font-medium">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts about this project..."
              rows={3}
              className={`min-h-[80px] text-sm ${errors.feedback ? "border-red-500" : ""}`}
              disabled={isSubmitting}
              {...register("feedback")}
            />
            {errors.feedback && (
              <p className="text-xs text-red-500 mt-1">{errors.feedback.message}</p>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto h-9 text-sm"
            disabled={isSubmitting || !selectedRating}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Thank you for your feedback! I appreciate your input.</span>
        </div>
      )}
    </div>
  );
}
