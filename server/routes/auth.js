const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (User) => {
  
  // Маршрут для реєстрації
  router.post('/register', async (req, res) => {
    try {
      const { fullName, email, password, role, phone, address } = req.body;

      // Перевірка, чи існує користувач
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'Користувач з таким email вже існує' });
      }

      // Шифрування пароля
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Створення користувача з новими полями
      const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'client',
        phone,   
        address  
      });

      res.status(201).json({ 
        message: 'Користувача успішно зареєстровано!', 
        userId: newUser.id 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка на сервері при реєстрації' });
    }
  });

  // МАРШРУТ ДЛЯ ВХОДУ (LOGIN)
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Шукаємо користувача за email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
      }

      // Перевіряємо пароль
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Невірний пароль' });
      }

      // Створюємо JWT токен
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret', 
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,     
          address: user.address   
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при вході' });
    }
  });
  
  return router;
};