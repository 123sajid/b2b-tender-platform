const express = require('express');
const router = express.Router();
const { registerUser, loginUser, protectedRoute } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', authenticateJWT, protectedRoute);

module.exports = router;
