// src/pages/ProfilePage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import PostCard from "../components/PostCard";
// import Alert from "../components/Alert";
// import { followUser, getUserByUsername, getUserPosts } from "../api/usersApi";

// const ProfilePage = () => {
//   const { username } = useParams(); // URL params ကနေ username ကို ယူမယ်
//   const [profile, setProfile] = useState(null); // Profile data
//   const [posts, setPosts] = useState([]); // User ရဲ့ posts
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user: currentUser } = useAuth(); // လက်ရှိ login ဝင်ထားတဲ့ user
//   const [isFollowing, setIsFollowing] = useState(false); // Follow လုပ်ထားလား စစ်ဖို့

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Backend ကနေ user profile နဲ့ posts တွေကို တပြိုင်နက်တည်း ခေါ်မယ်
//         const profileRes = await getUserByUsername(username);
//         const fetchedProfile = profileRes.data;
//         setProfile(fetchedProfile);
//         if (fetchedProfile) {
//           const postsRes = await getUserPosts(username);
//           setPosts(postsRes.data);
//         }

//         if (fetchedProfile?.followers.includes(currentUser?._id)) {
//           setIsFollowing(true);
//         } else {
//           setIsFollowing(false);
//         }
//       } catch (err) {
//         console.error("Failed to fetch profile:", err);
//         setError("Failed to load user profile. User not found or an error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, [username, currentUser]);

//   // Follow/Unfollow လုပ်မယ့် function
//   const handleFollowToggle = async () => {
//     try {
//       await followUser(profile.username);
//       setIsFollowing(!isFollowing); // State ကို ပြောင်းမယ်
//     } catch (error) {
//       console.error("Failed to follow/unfollow:", error);
//       setError("Failed to perform action.");
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-xl mt-10">Loading profile...</div>;
//   }

//   if (error) {
//     return <Alert type="error" message={error} />;
//   }

//   if (!profile) {
//     return <Alert type="info" message="User profile not found." />;
//   }

//   // Profile owner ကို စစ်မယ်
//   const isProfileOwner = currentUser?.username === profile.username;

//   return (
//     <div className="max-w-xl mx-auto space-y-6">
//       {/* Profile Header */}
//       <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center border border-gray-200">
//         <img
//           src={profile.profilePicture}
//           alt={profile.username}
//           className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
//         />
//         <h1 className="text-3xl font-bold mt-4 text-gray-800">{profile.username}</h1>
//         <div className="flex space-x-6 mt-4 text-gray-600">
//           <span>
//             <span className="font-semibold text-gray-900">{profile.followers.length}</span> Followers
//           </span>
//           <span>
//             <span className="font-semibold text-gray-900">{profile.followings.length}</span> Following
//           </span>
//           <span>
//             <span className="font-semibold text-gray-900">{posts.length}</span> Posts
//           </span>
//         </div>

//         {!isProfileOwner && (
//           <button
//             onClick={handleFollowToggle}
//             className={`mt-6 px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
//               isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//           >
//             {isFollowing ? "Unfollow" : "Follow"}
//           </button>
//         )}
//       </div>

//       {/* User's Posts */}
//       <h2 className="text-2xl font-bold mt-8 text-gray-800 text-center">{profile.username}'s Posts</h2>
//       <div className="space-y-6">
//         {posts.length > 0 ? (
//           posts.map((post) => <PostCard key={post._id} post={post} />)
//         ) : (
//           <p className="text-center text-gray-500 mt-10">No posts from this user yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// src/pages/ProfilePage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Alert from "../components/Alert";
import { followUser, getUserByUsername, getUserPosts } from "../api/usersApi";

// API call logic
const fetchProfile = async (username) => {
  const res = await getUserByUsername(username);
  return res.data;
};

const fetchUserPosts = async (username) => {
  const res = await getUserPosts(username);
  return res.data;
};

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch profile data using useQuery
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["user", username], // Query key is now an array
    queryFn: () => fetchProfile(username),
  });

  // Fetch user's posts using useQuery
  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ["userPosts", username],
    queryFn: () => fetchUserPosts(username),
    enabled: !!profile, // This query will only run if a profile is found
  });

  // Follow/Unfollow Mutation with Optimistic Update
  const followMutation = useMutation({
    mutationFn: (usernameToFollow) => followUser(usernameToFollow),
    onMutate: async () => {
      // Cancel any outgoing refetches to prevent optimistic updates from being overwritten
      await queryClient.cancelQueries({ queryKey: ["user", username] });

      // Snapshot the current user's profile data
      const previousProfile = queryClient.getQueryData(["user", username]);

      // Optimistically update the UI to reflect the follow/unfollow
      queryClient.setQueryData(["user", username], (oldProfile) => {
        if (!oldProfile) return oldProfile;
        const newFollowers = oldProfile.followers.includes(currentUser?._id)
          ? oldProfile.followers.filter((id) => id !== currentUser._id)
          : [...oldProfile.followers, currentUser._id];
        return { ...oldProfile, followers: newFollowers };
      });

      // Return a context object with the snapshot value
      return { previousProfile };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context snapshot to roll back
      queryClient.setQueryData(["user", username], context.previousProfile);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure the data is synced with the server
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
  });

  // Check loading states
  if (isProfileLoading || isPostsLoading) {
    return <div className="text-center text-xl mt-10">Loading profile...</div>;
  }

  // Check for errors
  if (isProfileError || isPostsError) {
    const errorMessage = profileError?.message || postsError?.message || "An unexpected error occurred.";
    return <Alert type="error" message={errorMessage} />;
  }

  // Check if profile exists
  if (!profile) {
    return <Alert type="info" message="User profile not found." />;
  }

  const isProfileOwner = currentUser?.username === profile.username;
  const isFollowing = profile.followers.includes(currentUser?._id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center border border-gray-200">
        <img
          src={profile.profilePicture}
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-4 text-gray-800">{profile.username}</h1>
        <div className="flex space-x-6 mt-4 text-gray-600">
          <span>
            <span className="font-semibold text-gray-900">{profile.followers?.length}</span> Followers
          </span>
          <span>
            <span className="font-semibold text-gray-900">{profile.followings?.length}</span> Following
          </span>
          <span>
            <span className="font-semibold text-gray-900">{posts?.length}</span> Posts
          </span>
        </div>

        {!isProfileOwner && (
          <button
            onClick={() => followMutation.mutate(profile.username)}
            disabled={followMutation.isLoading}
            className={`mt-6 px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {followMutation.isLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* User's Posts */}
      <h2 className="text-2xl font-bold mt-8 text-gray-800 text-center">{profile.username}'s Posts</h2>
      <div className="space-y-6">
        {posts?.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-gray-500 mt-10">No posts from this user yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
