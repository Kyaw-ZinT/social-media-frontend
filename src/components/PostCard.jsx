// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import CommentSection from "./CommentSection";
// import { likePost, addComment } from "../api/postsApi";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// export default function PostCard({ post }) {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const formatData = (dataString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dataString).toLocaleDateString(undefined, options);
//   };

//   const likeMutation = useMutation({
//     mutationFn: () => likePost(post._id), // API function ကို တိုက်ရိုက်ခေါ်မယ်
//     onSuccess: () => {
//       // Mutation အောင်မြင်ရင် 'posts' query ကို invalidate လုပ်ပြီး data ကို refresh လုပ်မယ်
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

//   // Comment API ကို ခေါ်မယ့် Mutation
//   const commentMutation = useMutation({
//     mutationFn: (commentData) => addComment(post._id, commentData),
//     onSuccess: () => {
//       // Comment အောင်မြင်ရင် 'posts' query ကို invalidate လုပ်မယ်
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//     },
//   });

//   // const handleLike = async () => {
//   //   if (loading) return;
//   //   setLoading(true);
//   //   try {
//   //     const response = await likePost(post._id);
//   //     // setPost({ ...post, likes: response.data.likes });
//   //     setPost(response.data);
//   //   } catch (error) {
//   //     console.error("Error liking post:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleLike = () => {
//     likeMutation.mutate(); // Mutation ကို စတင်လုပ်ဆောင်မယ်
//   };

//   // const handleNewComment = (newComment) => {
//   //   setPost((prevPost) => ({
//   //     ...prevPost,
//   //     comments: [...prevPost.comments, newComment],
//   //   }));
//   // };

//   const handleNewComment = (commentText) => {
//     commentMutation.mutate({ text: commentText }); // Backend API ကို ပို့မယ့် data
//   };

//   // const isLiked = post.likes.includes(user?._id);
//   const isLiked = post.likes?.includes(user?._id);

//   return (
//     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//       <div className="flex items-center mb-4">
//         <img
//           src={post.user.profilePicture}
//           alt={post.user.username}
//           className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
//         />
//         <div className="ml-3">
//           <Link
//             to={`/profile/${post.user.username}`}
//             className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
//           >
//             {post.user.username}
//           </Link>
//           <p className="text-sm text-gray-500">{formatData(post.createdAt)}</p>
//         </div>
//       </div>
//       {post.text && <p className="mb-4 text-gray-800 leading-relaxed">{post.text}</p>}
//       {post.image && (
//         <img
//           src={post.image}
//           alt="Post"
//           className="w-full h-auto rounded-lg mb-4 object-contain"
//           style={{ maxHeight: "60vh" }}
//         />
//       )}

//       <div className="flex items-center justify-between text-gray-600 text-sm">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleLike}
//             className={`flex items-center  transition-colors ${
//               isLiked ? "text-red-500" : "hover:text-red-500"
//             } disabled:opacity-50`}
//             disabled={likeMutation.isLoading}
//           >
//             <svg
//               className="w-5 h-5 mr-1"
//               fill={isLiked ? "currentColor" : "none"}
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               ></path>
//             </svg>
//             <span>{post.likes.length} Likes</span>
//           </button>
//           <button className="flex items-center hover:text-blue-600 transition-colors">
//             <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-1.025a2 2 0 00-1.666 1.139l-1.428 2.856a.75.75 0 01-1.398 0l-1.428-2.856A2 2 0 007.025 15H4a2 2 0 01-2-2V5z"></path>
//             </svg>
//             <span>{post.comments.length} Comments</span>
//           </button>
//         </div>
//       </div>
//       <CommentSection postId={post._id} initialComments={post.comments} onNewComment={handleNewComment} />
//     </div>
//   );
// }

import React from "react"; // useState, useEffect မလိုတော့ပါ
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentSection from "./CommentSection";
import { likePost, addComment } from "../api/postsApi"; // addComment ကိုလည်း import လုပ်မယ်
import { useMutation, useQueryClient } from "@tanstack/react-query";

// post prop က React Query ရဲ့ cache ကနေ လာတဲ့အတွက် initialPost နဲ့ useState မလိုတော့ဘူး
export default function PostCard({ post }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const formatData = (dataString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dataString).toLocaleDateString(undefined, options);
  };

  // Like or Unlike API ကို ခေါ်မယ့် Mutation
  const likeMutation = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: () => {
      // Mutation အောင်မြင်ရင် 'posts' query ကို invalidate လုပ်ပြီး data ကို refresh လုပ်မယ်
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Comment API ကို ခေါ်မယ့် Mutation
  const commentMutation = useMutation({
    mutationFn: (commentText) => addComment(post._id, { text: commentText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleNewComment = (commentText) => {
    commentMutation.mutate(commentText);
  };

  // const isLiked = post.likes?.includes(user?._id);
  const isLiked = post?.likes?.includes(user?._id);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {/* User Info ကို Link ထည့်လိုက်မယ် */}
        {post?.user && (
          <Link to={`/profile/${post.user.username}`} className="flex items-center">
            <img
              src={post.user?.profilePicture} // post.user?.profilePicture လို့ သုံးပါ
              alt={post.user?.username}
              className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
            />
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {post.user?.username}
              </p>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        )}
      </div>

      <Link to={`/posts/${post._id}`} className="block">
        {post.text && <p className="mb-4 text-gray-800 leading-relaxed">{post.text}</p>}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full h-auto rounded-lg mb-4 object-contain"
            style={{ maxHeight: "60vh" }}
          />
        )}
      </Link>

      <div className="flex items-center justify-between text-gray-600 text-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center  transition-colors ${
              isLiked ? "text-red-500" : "hover:text-red-500"
            } disabled:opacity-50`}
            disabled={likeMutation.isLoading} // useMutation.isLoading ကို သုံးမယ်
          >
            <svg
              className="w-5 h-5 mr-1"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{post.likes.length} Likes</span>
          </button>

          <Link to={`/posts/${post._id}`} className="flex items-center hover:text-blue-600 transition-colors">
            <button className="flex items-center hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-1.025a2 2 0 00-1.666 1.139l-1.428 2.856a.75.75 0 01-1.398 0l-1.428-2.856A2 2 0 007.025 15H4a2 2 0 01-2-2V5z"></path>
              </svg>
              <span>{post.comments.length} Comments</span>
            </button>
          </Link>
        </div>
      </div>
      <CommentSection postId={post._id} initialComments={post.comments} onNewComment={handleNewComment} />
    </div>
  );
}
