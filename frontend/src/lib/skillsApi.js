import api from "../context/apiinstance";

// POST  – create a new skill
export const createSkill = (payload) =>
  api.post("/skills", payload).then((r) => r.data);

// PUT – update own skill by id
export const updateSkill = (id, payload) =>
  api.put(`/skills/${id}`, payload).then((r) => r.data);

// DELETE – delete own skill by id
export const deleteSkill = (id) =>
  api.delete(`/skills/${id}`).then((r) => r.data);

// GET – all active skills (public feed)
export const fetchAllSkills = (params = {}) =>
  api.get("/skills", { params }).then((r) => r.data);

// GET – my own skills
export const fetchMySkills = (params = {}) =>
  api.get("/skills/my", { params }).then((r) => r.data);

// GET – single skill by id
export const fetchSkillById = (id) =>
  api.get(`/skills/${id}`).then((r) => r.data);

// PATCH – toggle isActive
export const toggleSkillStatus = (id) =>
  api.patch(`/skills/${id}/toggle`).then((r) => r.data);
