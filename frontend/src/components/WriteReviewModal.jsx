import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { reviewApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function WriteReviewModal({ isOpen, onClose, product, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      error('Please provide both a headline and review details');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reviewApi.submitReview({
        productId: product.id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });
      success('Review submitted successfully! Thank you for your feedback.');
      if (onReviewSubmitted) onReviewSubmitted(res.data);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up my-6">
        {/* Header */}
        <div className="bg-amazon-navy text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Create Customer Review</h3>
            <p className="text-xs text-gray-300 truncate max-w-xs">{product.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Rating Picker */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-current text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-gray-700">
                {rating === 5 ? '5 Stars - Outstanding' :
                 rating === 4 ? '4 Stars - Very Good' :
                 rating === 3 ? '3 Stars - Average' :
                 rating === 2 ? '2 Stars - Poor' : '1 Star - Terrible'}
              </span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Add a headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow"
              required
            />
          </div>

          {/* Detailed Review */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Write your review
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the delivery, build quality, and performance?"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-yellow"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Your review will appear with a <b>Verified Purchase</b> badge.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amazon-yellow hover:bg-[#f3a847] text-gray-950 font-bold rounded-lg text-xs transition shadow disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
