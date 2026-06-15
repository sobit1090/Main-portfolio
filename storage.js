const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const jsonPath = path.join(__dirname, "data", "projects.json");

// MongoDB Model Setup
let ProjectModel;
let useMongo = false;

if (process.env.MONGODB_URI) {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    const projectSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      githubLink: { type: String, default: "" },
      deployLink: { type: String, default: "" },
      slug: { type: String, default: "" },
      isLocal: { type: Boolean, default: false }
    });
    ProjectModel = mongoose.model("Project", projectSchema);
    useMongo = true;
    console.log("Connected to MongoDB via MONGODB_URI");
  } catch (err) {
    console.error("Failed to connect to MongoDB, falling back to local JSON:", err);
  }
}

// JSON storage helper functions
function readJson() {
  try {
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
      fs.writeFileSync(jsonPath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file, returning empty array:", err);
    return [];
  }
}

function writeJson(data) {
  try {
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing JSON file:", err);
  }
}

// Unified API for storage
async function getProjects() {
  if (useMongo) {
    const projects = await ProjectModel.find({}).lean();
    return projects.map(p => ({ ...p, id: p._id.toString() }));
  } else {
    return readJson();
  }
}

async function getProjectById(id) {
  if (useMongo) {
    const project = await ProjectModel.findById(id).lean();
    return project ? { ...project, id: project._id.toString() } : null;
  } else {
    const projects = readJson();
    return projects.find(p => p.id === id) || null;
  }
}

async function addProject(data) {
  if (useMongo) {
    const project = new ProjectModel({
      title: data.title,
      description: data.description,
      image: data.image,
      githubLink: data.githubLink || "",
      deployLink: data.deployLink || "",
      slug: data.slug || "",
      isLocal: data.isLocal === true || data.isLocal === "true"
    });
    const saved = await project.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  } else {
    const projects = readJson();
    const newId = Date.now().toString();
    const newProject = {
      id: newId,
      title: data.title,
      description: data.description,
      image: data.image,
      githubLink: data.githubLink || "",
      deployLink: data.deployLink || "",
      slug: data.slug || "",
      isLocal: data.isLocal === true || data.isLocal === "true"
    };
    projects.push(newProject);
    writeJson(projects);
    return newProject;
  }
}

async function updateProject(id, data) {
  if (useMongo) {
    const updated = await ProjectModel.findByIdAndUpdate(id, {
      title: data.title,
      description: data.description,
      image: data.image,
      githubLink: data.githubLink || "",
      deployLink: data.deployLink || "",
      slug: data.slug || "",
      isLocal: data.isLocal === true || data.isLocal === "true"
    }, { new: true }).lean();
    return updated ? { ...updated, id: updated._id.toString() } : null;
  } else {
    const projects = readJson();
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx] = {
        ...projects[idx],
        title: data.title,
        description: data.description,
        image: data.image,
        githubLink: data.githubLink || "",
        deployLink: data.deployLink || "",
        slug: data.slug || "",
        isLocal: data.isLocal === true || data.isLocal === "true"
      };
      writeJson(projects);
      return projects[idx];
    }
    return null;
  }
}

async function deleteProject(id) {
  if (useMongo) {
    const result = await ProjectModel.findByIdAndDelete(id);
    return !!result;
  } else {
    const projects = readJson();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length !== projects.length) {
      writeJson(filtered);
      return true;
    }
    return false;
  }
}

module.exports = {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject
};
