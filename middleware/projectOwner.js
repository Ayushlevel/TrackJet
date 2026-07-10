const Project = require("../models/Project");

const projectOwner = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only owner allowed."
            });
        }

        req.project = project;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = projectOwner;