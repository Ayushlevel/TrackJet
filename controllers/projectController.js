const Project = require("../models/Project");
const User = require("../models/User");

// Create Project

exports.createProject = async(req,res)=>{

    try{

        const {title,description}=req.body;

        const project = await Project.create({

            title,
            description,
            owner:req.user.id,
            members:[req.user.id]

        });

        res.status(201).json({

            success:true,
            message:"Project Created Successfully",
            project

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Get All Projects

exports.getProjects = async(req,res)=>{

    try{

        const projects = await Project.find({

            members:req.user.id

        }).populate("owner","name email");

        res.status(200).json({

            success:true,
            projects

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Get Single Project

exports.getProject = async(req,res)=>{

    try{

        const project = await Project.findById(req.params.projectId)
        .populate("owner","name email")
        .populate("members","name email");

        if(!project){

            return res.status(404).json({

                success:false,
                message:"Project Not Found"

            });

        }

        res.status(200).json({

            success:true,
            project

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Update Project

exports.updateProject=async(req,res)=>{
   try{
     // find project
     const project = await Project.findById(req.params.projectId);

     //existence of project
     if(!project){
        return res.status(404).json({

        success: false,
        message: "Project Not Found"

        });
    }
      if(project.owner.toString() !== req.user.id){
        return res.status(403).json({
        success: false,
        message: " Only the project owner can update the project "

        });
    }
     const updatedProject= await Project.findByIdAndUpdate(req.params.projectId,
        
        req.body,{

            new: true,
            runValidators: true

        }
     );

     res.status(200).json({
            success: true,
            message: "Project Updated Successfully",
            project: updatedProject
        });

     }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });


      

    };   
}

// Delete Project

exports.deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        // Only owner can delete project
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the project owner can delete this project"
            });
        }

        await Project.findByIdAndDelete(req.params.projectId);

        res.status(200).json({
            success: true,
            message: "Project Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// Add Member to Project

exports.addMember = async (req, res) => {

    try {

        const { email } = req.body;

        const project = await Project.findById(req.params.projectId);

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        if (project.owner.toString() !== req.user.id) {
           return res.status(403).json({
             success: false,
             message: "Only the project owner can add members"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User Not Found"

            });

        }

        if (project.members.includes(user._id)) {

            return res.status(400).json({

                success: false,
                message: "User is already a member"

            });

        }

        project.members.push(user._id);

        await project.save();

        res.status(200).json({

            success: true,
            message: "Member Added Successfully",
            project

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Get Project Members

exports.getMembers = async (req, res) => {

    try {

        const project = await Project.findById(req.params.projectId)
            .populate("members", "name email");

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        res.status(200).json({

            success: true,
            members: project.members

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Remove Member

exports.removeMember = async (req, res) => {

    try {

        const project = await Project.findById(req.params.projectId);

        if (!project) {

            return res.status(404).json({

                success: false,
                message: "Project Not Found"

            });

        }

        if(project.owner.toString()  !== req.user.id){
            return res.status(403).json({
                success:false,
                message:"Member can be only remove by owner"
            });
        }

        
        project.members = project.members.filter(

            member => member.toString() !== req.params.userId

        );

        await project.save();

        res.status(200).json({

            success: true,
            message: "Member Removed Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};