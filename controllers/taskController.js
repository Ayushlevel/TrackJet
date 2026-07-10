const Task = require("../models/Task");
const Project = require("../models/Project");


// ===============================
// CREATE TASK
// ===============================
exports.createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        // Check if user is project member
        if (!existingProject.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "You are not a project member"
            });
        }

        // Validate assigned user belongs to project
        if (assignedTo && !existingProject.members.includes(assignedTo)) {
            return res.status(400).json({
                success: false,
                message: "Assigned user is not a project member"
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo: assignedTo || null,
            createdBy: req.user.id,
            priority: priority || "medium",
            dueDate: dueDate || null,
            status: "todo"
        });

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET ALL TASKS OF PROJECT
// ===============================
exports.getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status, assignedTo } = req.query;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        // Auth check
        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        let filter = { project: projectId };
         if (status) {
                    filter.status = status;
                }

                if (assignedTo) {
                    filter.assignedTo = assignedTo;
                }

                if (req.query.priority) {
                    filter.priority = req.query.priority;
                }

                if (req.query.search) {
                    filter.title = {
                        $regex: req.query.search,
                        $options: "i",
                    };
                }
        const tasks = await Task.find(filter)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// GET SINGLE TASK
// ===============================
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email")
            .populate("project", "title");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        res.status(200).json({
            success: true,
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// UPDATE TASK
// ===============================
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email")
            .populate("project", "title");

        res.status(200).json({
            success: true,
            message: "Task Updated Successfully",
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// DELETE TASK
// ===============================
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });
        }

        const project = await Project.findById(task.project);

        // only project owner OR task creator can delete
        if (
            project.owner.toString() !== req.user.id &&
            task.createdBy.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this task"
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Task Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ===============================
// CHANGE TASK STATUS
// ===============================
exports.changeTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = ["todo", "in-progress", "done"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        task.status = status;
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task Status Updated Successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ===============================
// ASSIGN TASK
// ===============================
exports.assignTask = async (req, res) => {
    try {
        const { assignedTo } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        // Only project owner can assign tasks
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only project owner can assign tasks"
            });
        }

        // Check that assigned user belongs to project
        if (!project.members.some(
            member => member.toString() === assignedTo
        )) {
            return res.status(400).json({
                success: false,
                message: "User is not a project member"
            });
        }

        task.assignedTo = assignedTo;

        await task.save();

        await task.populate("assignedTo", "name email");

        res.status(200).json({
            success: true,
            message: "Task assigned successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};