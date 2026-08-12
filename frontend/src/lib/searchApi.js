import api from "../context/apiinstance";

// GET – Live user profile search suggestions
export const searchUsers = (q) =>
  api.get("/search/users", { params: { q } }).then((r) => r.data);

// GET – Public profile view for a specific user ID
export const fetchPublicProfile = (id) =>
  api.get(`/search/profile/${id}`).then((r) => r.data);
