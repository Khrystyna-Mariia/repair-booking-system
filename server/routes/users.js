const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware');

module.exports = (User) => {
  // Отримати всіх користувачів (Тільки адмін)
  router.get('/', verifyAdmin, async (req, res) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Помилка сервера" });
    }
  });

  // Видалити користувача
  router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } });
      res.json({ message: "Користувача видалено" });
    } catch (error) {
      res.status(500).json({ message: "Помилка при видаленні" });
    }
  });

  // Оновлення профілю 
  router.patch('/:id', async (req, res) => {
    try {
      await User.update(req.body, { where: { id: req.params.id } });
      res.json({ message: "Профіль оновлено" });
    } catch (error) {
      res.status(500).json({ message: "Помилка оновлення" });
    }
  });

  return router;
};