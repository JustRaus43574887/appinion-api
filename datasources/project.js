const { DataSource } = require("apollo-datasource");
const Project = require("../models/Project");

class ProjectAPI extends DataSource {
  async createProject(data) {
    const project = new Project(data);
    await project.save();
    return project;
  }

  async getUserProjects(id) {
    return await Project.find({ userId: id });
  }

  async getCurrentProject(id) {
    return await Project.findById(id);
  }
}

module.exports = ProjectAPI;
