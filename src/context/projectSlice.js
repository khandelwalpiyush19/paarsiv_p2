import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: [],
  },
  reducers: {
    // Set entire projects array
    setAllProjects: (state, action) => {
      console.log("Dispatched projects:", action.payload);
      state.allProjects = action.payload;
    },

    // Add a single new project
    addProject: (state, action) => {
  console.log("Added project:", action.payload);

  const normalizedProject = {
    ...action.payload,
    projectLeader: Array.isArray(action.payload.projectLeader)
      ? action.payload.projectLeader.map(p => p._id)
      : [action.payload.projectLeader._id], // handles single object
    projectMembers: action.payload.projectMembers.map(member => member._id),
  };

  state.allProjects.unshift(normalizedProject);
},
  },
});

export const { setAllProjects, addProject } = projectSlice.actions;
export default projectSlice.reducer;
