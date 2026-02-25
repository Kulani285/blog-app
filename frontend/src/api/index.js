import axios from 'axios';

const BASE_URL = 'https://blog-app-backend-wvm2.onrender.com/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Posts
export const getPosts = (page = 0, size = 9) =>
  api.get(`/posts?page=${page}&size=${size}`);

export const getAllPosts = (page = 0, size = 10) =>
  api.get(`/posts/all?page=${page}&size=${size}`);

export const getPostById = (id) => api.get(`/posts/${id}`);
export const getPostBySlug = (slug) => api.get(`/posts/slug/${slug}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const searchPosts = (q, page = 0) => api.get(`/posts/search?q=${q}&page=${page}`);
export const getPostsByTag = (tag, page = 0) => api.get(`/posts/tag/${tag}?page=${page}`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Tags
export const getTags = () => api.get('/tags');

export default api;
