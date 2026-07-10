const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");


const {
    createTask,
    getProjectTasks,
    getTask,
    updateTask,
    deleteTask,
    changeTaskStatus,
    assignTask
} = require("../controllers/taskController");

router.post("/", auth, createTask);
router.get("/project/:projectId", auth, getProjectTasks);
router.get("/:id", auth, getTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.patch("/status/:id" , auth , changeTaskStatus);
router.patch("/assign/:id", auth , assignTask);
module.exports = router;



