const express = require("express");

const router = express.Router();

const {

createProject,
getProjects,
getProject,
updateProject,
deleteProject,
addMember,
getMembers,
removeMember

}=require("../controllers/projectController");

const auth=require("../middleware/authMiddleware");
const projectAccess= require("../middleware/projectAccess");
const projectOwner=require("../middleware/projectOwner");

router.post("/",auth,createProject);

router.get("/",auth,getProjects);

router.get("/:projectId",auth,projectAccess,getProject);

router.put("/:projectId",auth,projectOwner,updateProject);

router.delete("/:projectId",auth,projectOwner,deleteProject);

//member routes
router.post("/:projectId/members", auth, projectOwner,addMember);

router.get("/:projectId/members", auth,projectAccess, getMembers);

router.delete("/:projectId/members/:userId", auth,projectOwner, removeMember);

module.exports=router;

