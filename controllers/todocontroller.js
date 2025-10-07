const Todo = require('../models/Todo');

exports.createtodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });

    const todo = await Todo.create({ title, description, user: userId });
    res.status(201).json({ success: true, message: 'Todo created', todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.gettodo = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, getodo: todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching todos', error: err.message });
  }
};

exports.updatetodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating todo', error: err.message });
  }
};

exports.deletetodo = async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Todo not found' });
    res.status(200).json({ success: true, message: 'Todo deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting todo', error: err.message });
  }
};
