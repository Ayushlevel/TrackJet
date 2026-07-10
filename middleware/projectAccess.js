const Project = require("../models/Project");

const projectAccess = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // check if user is member
        const isMember = project.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not a project member."
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

module.exports = projectAccess;