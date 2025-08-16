import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function CommentSection({ postId, initialComments, onNewComment }) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");

  const { user } = useAuth();
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/posts/${postId}/comments`, { text: commentText });
      const newComment = response.data;
      setComments([...comments, newComment]);
      setCommentText("");
      if (onNewComment) {
        onNewComment(newComment);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-md text-gray-700 font-semibold mb-4">Comments ({comments.length})</h3>
      <div className="max-h-64 space-y-4 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div className="flex items-start" key={comment._id}>
            <img
              src={comment.user.profilePicture}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="ml-3 bg-gray-100 rounded-xl p-3 flex-grow">
              <Link to={`/profile/${comment.user.username}`} className="font-semibold text-sm hover:underline">
                {comment.user.username}
              </Link>
              <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center space-x-2">
          <img
            src={user.profilePicture}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
          />
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
