// src/api/usersApi.js
import api from "./axios";

export const getUserByUsername = (username) => api.get(`/users/${username}`);
export const getUserPosts = (username) => api.get(`/users/${username}/posts`);
export const followUser = (username) => api.put(`/users/${username}/follow`);
