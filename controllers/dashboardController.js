const Project = require("../models/Project");
const Task = require("../models/Task");

exports.getDashboard = async (req, res) => {
    try {

        // Projects where logged-in user is a member
        const projects = await Project.find({
            members: req.user.id
        });
        console.log("User ID:", req.user.id);
         console.log("Projects:", projects);
        

        const projectIds = projects.map(project => project._id);

        // Tasks of those projects
        const tasks = await Task.find({
            project: { $in: projectIds }
        });
         console.log("Tasks", tasks);
        // Project statistics
        const totalProjects = projects.length;

        const activeProjects = projects.filter(
            project => project.status === "Active"
        ).length;

        const completedProjects = projects.filter(
            project => project.status === "Completed"
        ).length;

        // Task statistics
        const totalTasks = tasks.length;

        const todoTasks = tasks.filter(
            task => task.status === "todo"
        ).length;

        const inProgressTasks = tasks.filter(
            task => task.status === "in-progress"
        ).length;

        const doneTasks = tasks.filter(
            task => task.status === "done"
        ).length;

        const highPriorityTasks = tasks.filter(
            task => task.priority === "high"
        ).length;
        
        //recent projects
        const recentProjects = await Project.find({
              

             members: { $in: [req.user.id] }
        })
            
             .sort({ createdAt: -1 })
              .limit(5)
        .select("title status createdAt");
        
         // recent tasks
        const recentTasks = await Task.find({
          project: { $in: projectIds }
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("assignedTo", "name")
          .select("title status priority assignedTo createdAt"

        );

        const overdueTasks = tasks.filter(task =>
            task.dueDate &&
            task.dueDate < new Date() &&
            task.status !== "done"
        ).length;

        res.status(200).json({
            success: true,

            dashboard: {

        stats: {

        totalProjects,
        activeProjects,
        completedProjects,

        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,

        highPriorityTasks,
        overdueTasks

         },

         recentProjects,

         recentTasks

        }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};