// src/api/postsApi.js
import api from "./axios";

export const getPosts = () => api.get("/posts");
export const createPost = (postData) => api.post("/posts", postData);
export const likePost = (postId) => api.put(`/posts/${postId}/like`);
export const addComment = (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData);
