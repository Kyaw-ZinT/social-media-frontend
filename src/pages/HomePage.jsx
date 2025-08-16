// import PostCard from "../components/PostCard";
// import PostCreateForm from "../components/PostCreateForm";
// import { getPosts } from "../api/postsApi";
// import { useQuery, useQueryClient ,useInfiniteQuery,} from "@tanstack/react-query";
// import { useRef } from "react";

// const fetchPosts = async () => {
//   const response = await getPosts();
//   return response.data;
// };

// export default function HomePage() {
//   const queryClient = useQueryClient();
//   const observer = useRef();
//   const {
//     data: posts,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["posts"], // data အတွက် query key ကို သတ်မှတ်မယ်
//     queryFn: fetchPosts, // data ကို fetch လုပ်မယ့် function
//   });

//   // const fetchPosts = async () => {
//   //   try {
//   //     const response = await getPosts();
//   //     setPosts(response.data);
//   //   } catch (err) {
//   //     setError("Failed to fetch posts.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleNewPost = () => {
//     queryClient.invalidateQueries({ queryKey: ["posts"] });
//   };

//   if (isLoading) {
//     return <div className="text-center text-xl mt-10">Loading posts...</div>;
//   }

//   if (isError) {
//     return (
//       <div className="text-center text-xl mt-10 text-red-600">Error: {error.message || "Failed to fetch posts."}</div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto space-y-6">
//       <PostCreateForm onPostSuccess={handleNewPost} />
//       <h1 className="text-3xl text-center font-bold text-gray-800">Latest Posts</h1>
//       {posts?.length > 0 ? (
//         posts.map((post) => <PostCard key={post._id} post={post} onPostUpdate={handleNewPost} />)
//       ) : (
//         <p className="text-center text-gray-500 mt-10">No posts found. Be the first to post!</p>
//       )}
//     </div>
//   );
// }

// src/pages/HomePage.jsx
import React, { useRef, useCallback } from "react";
import PostCard from "../components/PostCard";
import PostCreateForm from "../components/PostCreateForm";
import api from "../api/axios"; // api ကို import လုပ်မယ်
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

// API call logic for infinite scrolling
const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await api.get(`/posts?page=${pageParam}&limit=10`);
  return response.data;
};

export default function HomePage() {
  const queryClient = useQueryClient();
  const observer = useRef();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const handleNewPost = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // posts data ကို pages array ကနေ single array အဖြစ်ပြောင်းမယ်
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading posts...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-xl mt-10 text-red-600">Error: {error.message || "Failed to fetch posts."}</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <PostCreateForm onPostSuccess={handleNewPost} />
      <h1 className="text-3xl text-center font-bold text-gray-800">Latest Posts</h1>
      {allPosts.length > 0 ? (
        allPosts.map((post, index) => {
          if (allPosts.length === index + 1) {
            // နောက်ဆုံး post ကို ref ထည့်ပေးမယ်
            return (
              <div ref={lastPostElementRef} key={post._id}>
                <PostCard post={post} onPostUpdate={handleNewPost} />
              </div>
            );
          }
          return <PostCard key={post._id} post={post} onPostUpdate={handleNewPost} />;
        })
      ) : (
        <p className="text-center text-gray-500 mt-10">No posts found. Be the first to post!</p>
      )}
      {isFetchingNextPage && <div className="text-center p-4">Loading more posts...</div>}
      {!hasNextPage && allPosts.length > 0 && <p className="text-center text-gray-500 p-4">You've reached the end!</p>}
    </div>
  );
}
