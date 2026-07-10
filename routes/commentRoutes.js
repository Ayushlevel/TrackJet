const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.post("/:taskId", auth, addComment);

router.get("/:taskId", auth, getComments);
router.put("/:commentId", auth, updateComment);
router.delete("/:commentId", auth, deleteComment);
module.exports = router;