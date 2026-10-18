
import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

// All task routes require a valid login
router.use(authMiddleware);

// Get current user's tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Fetch tasks error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// Create a task for the logged-in user
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      dueDate,
      completed,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description:
        typeof description === "string" ? description.trim() : "",
      category: category || "",
      priority: priority || "",
      dueDate: dueDate || "",
      completed: completed ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
});

// Update only the logged-in user's task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "priority",
      "dueDate",
      "completed",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined) {
      if (
        typeof updates.title !== "string" ||
        !updates.title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Task title is required",
        });
      }

      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updates.description =
        typeof updates.description === "string"
          ? updates.description.trim()
          : "";
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
});

// Delete only the logged-in user's task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

export default router;
