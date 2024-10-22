const { Router } = require("express");
const Todo = require("../database/schema/Todo");

const router = Router();

// Ensure user is authenticated
router.use((req, res, next) => {
  console.log("Checking authentication...");
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ error: "Unauthorized! Please log in." });
  }
});

// Create a new todo
router.post("/", async (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    return res.status(400).send({ error: "Todo text is required!" });
  }

  try {
    const newTodo = await Todo.create({
      text: todo,
      user: req.user._id, // Reference the current user's ID
      completed: false,
    });

    console.log(`Todo created: ${newTodo}`);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create todo" });
  }
});

// Fetch all todos for the authenticated user
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch todos" });
  }
});

// Mark a todo as done (toggle completed status)
router.put("/:id/toggle", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update todo" });
  }
});

// Rename a todo
router.put("/:id/rename", async (req, res) => {
  const { id } = req.params;
  const { newText } = req.body;

  if (!newText) {
    return res.status(400).send({ error: "New todo text is required!" });
  }

  try {
    const todo = await Todo.findOne({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }

    todo.text = newText;
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to rename todo" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

    if (!todo) {
      return res.status(404).send({ error: "Todo not found" });
    }

    res.status(200).send({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete todo" });
  }
});

module.exports = router;
