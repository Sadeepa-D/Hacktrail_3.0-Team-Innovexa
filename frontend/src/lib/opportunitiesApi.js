import api from "../context/apiinstance";

// POST  – create a new opportunity
export const createOpportunity = (payload) =>
  api.post("/opportunities", payload).then((r) => r.data);

// PUT – update own opportunity by id
export const updateOpportunity = (id, payload) =>
  api.put(`/opportunities/${id}`, payload).then((r) => r.data);

// DELETE – delete own opportunity
export const deleteOpportunity = (id) =>
  api.delete(`/opportunities/${id}`).then((r) => r.data);

// GET – all open opportunities (public feed)
export const fetchAllOpportunities = (params = {}) =>
  api.get("/opportunities", { params }).then((r) => r.data);

// GET – my posted opportunities
export const fetchMyOpportunities = (params = {}) =>
  api.get("/opportunities/my", { params }).then((r) => r.data);

// GET – single opportunity by id
export const fetchOpportunityById = (id) =>
  api.get(`/opportunities/${id}`).then((r) => r.data);

// PATCH – change opportunity status
export const updateOpportunityStatus = (id, status) =>
  api.patch(`/opportunities/${id}/status`, { status }).then((r) => r.data);

// POST – apply to an opportunity
export const applyToOpportunity = (id, payload) =>
  api.post(`/opportunities/${id}/apply`, payload).then((r) => r.data);

// GET – owner: view all applications for their opportunity
export const fetchOpportunityApplications = (id) =>
  api.get(`/opportunities/${id}/applications`).then((r) => r.data);

// GET – applicant: view own submitted applications
export const fetchMyApplications = () =>
  api.get("/opportunities/my-applications").then((r) => r.data);
