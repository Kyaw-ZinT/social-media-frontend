// src/pages/PostDetailPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Alert from "../components/Alert";

// API call logic
const fetchSinglePost = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

const PostDetailPage = () => {
  const { id } = useParams(); // URL parameters ကနေ Post ID ကို ယူမယ်

  // useQuery ကိုသုံးပြီး Post တစ်ခုတည်းကို fetch လုပ်မယ်
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", id], // Query key မှာ ID ပါထည့်မယ်
    queryFn: () => fetchSinglePost(id),
  });

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading post...</div>;
  }

  if (isError) {
    return <Alert type="error" message={error.message || "Failed to load post."} />;
  }

  if (!post) {
    return <Alert type="info" message="Post not found." />;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl text-center font-bold text-gray-800">Post Detail</h1>
      {/* PostCard component ကို အသုံးပြုပြီး post ကို ပြသမယ် */}
      <PostCard post={post} />
    </div>
  );
};

export default PostDetailPage;
