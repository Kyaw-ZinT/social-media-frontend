import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "./ImageUpload";
import api from "../api/axios";

export default function PostCreateForm({ onPostSuccess }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!text.trim() && !image) {
      setError("Post must contain text or an image.");
      return;
    }
    setLoading(true);
    try {
      const newPost = {
        text: text.trim(),
        image,
      };

      const response = await api.post("/posts", newPost);
      setText("");
      setImage("");
      if (onPostSuccess) {
        onPostSuccess();
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError(err.response?.data?.message || "Post creation failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleImageUploadSuccess = (url) => {
    setImage(url);
    setError(null);
    alert("Image uploaded successfully! You can now submit your post.");
  };

  if (!user) {
    return null;
  }
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create a new post</h2>
      {error && <Alert type="error" message={error} />}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea
          rows="4"
          placeholder={`What's on your mind,${user.username}?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none"
        ></textarea>
        {image && (
          <div className="relative">
            <img src={image} alt="Uploaded" className="w-full h-auto rounded-lg" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 leading-none text-sm hover:bg-red-600 transition"
            >
              {" "}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}
        <ImageUpload onUploadSuccess={handleImageUploadSuccess} />
        <button
          type="submit"
          disabled={loading || (!text.trim() && !image)}
          className="w-full bg-blue-600 py-3 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Posting" : "Post"}
        </button>
      </form>
    </div>
  );
}
