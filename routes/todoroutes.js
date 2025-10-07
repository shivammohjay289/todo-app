const express = require('express');
const router = express.Router();
const { createtodo, gettodo, updatetodo, deletetodo } = require('../controllers/todocontroller');
const { verifyToken } = require('../middleware/authmiddleware');

router.post('/create', verifyToken, createtodo);
router.get('/get', verifyToken, gettodo);
router.put('/:id', verifyToken, updatetodo);
router.delete('/:id', verifyToken, deletetodo);

module.exports = router;
